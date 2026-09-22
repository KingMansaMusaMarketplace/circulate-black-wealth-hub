
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { BusinessFilters } from '@/lib/api/directory/types';
import { getBusinessBanner } from '@/utils/businessBanners';

// Interface matches the search_directory_businesses RPC return
interface SupabaseBusiness {
  id: string;
  business_name: string;
  name: string;
  description: string | null;
  category: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  website: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_verified: boolean;
  average_rating: number | null;
  review_count: number;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  listing_status: string | null;
  is_founding_member: boolean | null;
  is_founding_sponsor: boolean | null;
  category_group?: string | null;
  country?: string | null;
  total_count: number;
}

const mapSupabaseToFrontend = (business: SupabaseBusiness): Business => {
  const businessName = business.name || business.business_name || 'Unnamed Business';
  const logoUrl = business.logo_url || '';
  const bannerUrl = getBusinessBanner(business.id, business.banner_url, business.website, business.category) || '';
  const cardImage = bannerUrl || logoUrl;
  
  return {
    id: business.id,
    name: businessName,
    description: business.description || '',
    category: business.category || 'Other',
    address: business.address || '',
    city: business.city || '',
    state: business.state || '',
    zipCode: business.zip_code || '',
    phone: '',
    email: '',
    website: business.website || '',
    logoUrl: logoUrl,
    bannerUrl: bannerUrl,
    averageRating: Number(business.average_rating) || 0,
    reviewCount: business.review_count || 0,
    rating: Number(business.average_rating) || 0,
    discount: '',
    discountValue: 0,
    distance: '',
    distanceValue: 0,
    lat: business.latitude || 33.749,
    lng: business.longitude || -84.388,
    imageUrl: cardImage,
    imageAlt: businessName,
    isFeatured: false,
    isVerified: business.is_verified || false,
    ownerId: '',
    createdAt: business.created_at,
    updatedAt: business.updated_at
  };
};

const PAGE_SIZE = 24;

const DIRECTORY_SELECT = 'id, business_name, name, description, category, address, city, state, zip_code, website, logo_url, banner_url, is_verified, average_rating, review_count, latitude, longitude, created_at, updated_at, listing_status, is_founding_member, is_founding_sponsor';

const isStatementTimeout = (error: unknown) =>
  Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === '57014');

interface PlaceFilters {
  categoryGroup?: string;
  country?: string;
  state?: string;
  city?: string;
}

const fetchDirectoryFallback = async (
  searchTerm: string,
  filterOptions: BusinessFilters,
  limit: number,
  offset: number,
  place: PlaceFilters = {}
): Promise<{ results: SupabaseBusiness[]; totalCount: number }> => {
  let query = supabase
    .from('businesses')
    .select(DIRECTORY_SELECT, { count: 'estimated' })
    .eq('listing_status', 'live');

  if (searchTerm) {
    const safeTerm = searchTerm.replace(/[%,]/g, ' ').trim();
    if (safeTerm) {
      query = query.or(`business_name.ilike.%${safeTerm}%,name.ilike.%${safeTerm}%,city.ilike.%${safeTerm}%,state.ilike.%${safeTerm}%,category.ilike.%${safeTerm}%`);
    }
  }

  if (filterOptions.category && filterOptions.category !== 'all') {
    query = query.eq('category', filterOptions.category);
  }

  if (place.categoryGroup) query = (query as any).eq('category_group', place.categoryGroup);
  if (place.country) query = (query as any).eq('country', place.country);
  if (place.state) query = (query as any).eq('state', place.state);
  if (place.city) query = (query as any).eq('city', place.city);

  if (filterOptions.minRating && filterOptions.minRating > 0) {
    query = query.gte('average_rating', filterOptions.minRating);
  }

  const { data, error, count } = await query
    .order('is_verified', { ascending: false })
    .order('average_rating', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const totalCount = count || data?.length || 0;
  return {
    results: ((data || []) as Omit<SupabaseBusiness, 'total_count'>[]).map((business) => ({
      ...business,
      total_count: totalCount,
    })),
    totalCount,
  };
};

export const useSupabaseDirectory = () => {
  const queryClient = useQueryClient();
  const insertCountRef = useRef(0);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();

  // Read initial search term + category from URL query params
  // (e.g. /directory?search=restaurants or /directory?category=Acupuncture%20Practice)
  const initialSearch = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  }, []);

  const initialCategory = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || undefined;
  }, []);

  const readParam = (key: string) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || undefined;
  };

  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [page, setPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState<BusinessFilters>({
    category: initialCategory,
    minRating: 0,
    minDiscount: 0,
    featured: false,
    distance: 0,
  });

  // Browse-by-group and browse-by-place selections
  const [categoryGroup, setCategoryGroup] = useState<string | undefined>(() => readParam('group'));
  const [country, setCountry] = useState<string | undefined>(() => readParam('country'));
  const [stateCode, setStateCode] = useState<string | undefined>(() => readParam('state'));
  const [city, setCity] = useState<string | undefined>(() => readParam('city'));

  // Keep filters in sync if the user navigates between filtered directory URLs
  // (e.g. /directory?category=A → /directory?category=B) without remount.
  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    const urlCategory = params.get('category') || undefined;
    const urlSearch = params.get('search') || '';

    setFilterOptions(prev =>
      prev.category === urlCategory ? prev : { ...prev, category: urlCategory }
    );
    setSearchTerm(prev => (prev === urlSearch ? prev : urlSearch));
    setCategoryGroup(prev => {
      const next = params.get('group') || undefined;
      return prev === next ? prev : next;
    });
    setCountry(prev => {
      const next = params.get('country') || undefined;
      return prev === next ? prev : next;
    });
    setStateCode(prev => {
      const next = params.get('state') || undefined;
      return prev === next ? prev : next;
    });
    setCity(prev => {
      const next = params.get('city') || undefined;
      return prev === next ? prev : next;
    });
    setPage(1);
  }, [routerLocation.search]);

  // Push state OUT to the URL so refresh / share-link preserves the
  // user's category, place and search (memory: filter persistence rule).
  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    const desired: Record<string, string> = {
      category: filterOptions.category || '',
      search: searchTerm || '',
      group: categoryGroup || '',
      country: country || '',
      state: stateCode || '',
      city: city || '',
    };

    const unchanged = Object.entries(desired).every(
      ([key, value]) => (params.get(key) || '') === value
    );
    if (unchanged) return;

    Object.entries(desired).forEach(([key, value]) => {
      if (value) params.set(key, value); else params.delete(key);
    });
    const qs = params.toString();
    navigate(`${routerLocation.pathname}${qs ? `?${qs}` : ''}${routerLocation.hash}`, { replace: true });
  }, [filterOptions.category, searchTerm, categoryGroup, country, stateCode, city, navigate, routerLocation.pathname, routerLocation.hash, routerLocation.search]);


  // Realtime subscription: auto-refresh directory every 15 new inserts from Kayla
  useEffect(() => {
    const channel = supabase
      .channel(`kayla-directory-refresh-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'businesses' },
        () => {
          insertCountRef.current += 1;
          console.log(`[Kayla Live] New business detected (${insertCountRef.current}/15)`);
          if (insertCountRef.current >= 15) {
            console.log('[Kayla Live] 15 new businesses reached — refreshing directory');
            insertCountRef.current = 0;
            queryClient.invalidateQueries({ queryKey: ['directory-businesses'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Build query key from filters + pagination
  const queryKey = useMemo(() => [
    'directory-businesses',
    searchTerm || null,
    filterOptions.category || null,
    filterOptions.minRating || null,
    categoryGroup || null,
    country || null,
    stateCode || null,
    city || null,
    page,
  ], [searchTerm, filterOptions.category, filterOptions.minRating, categoryGroup, country, stateCode, city, page]);

  // Fetch paginated businesses from server-side RPC
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const offset = (page - 1) * PAGE_SIZE;

      const { data, error } = await (supabase.rpc as any)('search_directory_businesses', {
        p_search_term: searchTerm || null,
        p_category: filterOptions.category || null,
        p_min_rating: filterOptions.minRating || null,
        p_limit: PAGE_SIZE,
        p_offset: offset,
        p_category_group: categoryGroup || null,
        p_country: country || null,
        p_state: stateCode || null,
        p_city: city || null,
      });

      if (error) {
        if (isStatementTimeout(error)) {
          console.warn('[Directory] Search timed out; loading fallback results.', error);
          return fetchDirectoryFallback(searchTerm, filterOptions, PAGE_SIZE, offset, {
            categoryGroup,
            country,
            state: stateCode,
            city,
          });
        }
        throw error;
      }

      const results = (data || []) as SupabaseBusiness[];
      const totalCount = results.length > 0 ? Number(results[0].total_count) : 0;

      console.log(`[Directory] Page ${page}: loaded ${results.length} businesses (${totalCount} total)`);

      return { results, totalCount };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: (failureCount, queryError) => isStatementTimeout(queryError) && failureCount < 2,
    retryDelay: 800,
    refetchOnWindowFocus: false,
  });

  // Counts for each of the main category groups (respects the chosen place)
  const { data: groupsData } = useQuery({
    queryKey: ['directory-groups', country || null, stateCode || null, city || null],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)('get_directory_groups', {
        p_country: country || null,
        p_state: stateCode || null,
        p_city: city || null,
      });
      if (error) throw error;
      return (data || []) as { category_group: string; count: number }[];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Countries / states / cities available to browse
  const { data: countriesData } = useQuery({
    queryKey: ['directory-countries'],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)('get_directory_countries');
      if (error) throw error;
      return (data || []) as { country: string; count: number }[];
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: statesData } = useQuery({
    queryKey: ['directory-states', country || 'US'],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)('get_directory_states', {
        p_country: country || 'US',
      });
      if (error) throw error;
      return (data || []) as { state: string; count: number }[];
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: citiesData } = useQuery({
    queryKey: ['directory-cities', country || 'US', stateCode || null],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)('get_directory_cities', {
        p_country: country || 'US',
        p_state: stateCode || null,
        p_limit: 80,
      });
      if (error) throw error;
      return (data || []) as { city: string; state: string; count: number }[];
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch categories from dedicated RPC
  const { data: categoriesData } = useQuery({
    queryKey: ['directory-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_directory_categories');
      if (error) throw error;
      return (data || []) as { category: string; count: number }[];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch ALL map markers (lightweight: id, name, lat, lng, category only)
  const mapMarkersKey = useMemo(() => [
    'directory-map-markers',
    searchTerm || null,
    filterOptions.category || null,
    filterOptions.minRating || null,
  ], [searchTerm, filterOptions.category, filterOptions.minRating]);

  const { data: mapMarkersData } = useQuery({
    queryKey: mapMarkersKey,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_directory_map_markers', {
        p_search_term: searchTerm || null,
        p_category: filterOptions.category || null,
        p_min_rating: filterOptions.minRating || null,
      });
      if (error) throw error;
      return (data || []) as { id: string; business_name: string; latitude: number; longitude: number; category: string; average_rating: number }[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const rawBusinesses = data?.results || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Map to frontend Business type
  const businesses = useMemo(() => rawBusinesses.map(mapSupabaseToFrontend), [rawBusinesses]);

  // Categories from dedicated RPC
  const categories = useMemo(() => {
    return (categoriesData || []).map(c => c.category).filter(Boolean).sort();
  }, [categoriesData]);

  // Business counts per category from RPC data
  const businessCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (categoriesData || []).forEach(c => {
      if (c.category) counts[c.category] = Number(c.count);
    });
    return counts;
  }, [categoriesData]);

  // Map data from dedicated lightweight RPC (ALL businesses with coordinates)
  const mapData = useMemo(() => {
    const isValidCoord = (lat: unknown, lng: unknown) => {
      const la = Number(lat);
      const ln = Number(lng);
      return (
        Number.isFinite(la) && Number.isFinite(ln) &&
        la !== 0 && ln !== 0 &&
        la >= -90 && la <= 90 &&
        ln >= -180 && ln <= 180
      );
    };

    return (mapMarkersData || [])
      .filter(m => isValidCoord(m.latitude, m.longitude))
      .map(m => ({
        id: m.id,
        name: m.business_name,
        lat: Number(m.latitude),
        lng: Number(m.longitude),
        category: m.category || 'Other',
        rating: Number(m.average_rating) || 0,
        discount: '',
      }));
  }, [mapMarkersData]);

  const handleFilterChange = useCallback((newFilters: Partial<BusinessFilters>) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to page 1 on filter change
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to page 1 on search change
  }, []);

  const handleCityChange = useCallback((cityId: string) => {
    setSelectedCity(cityId);
    setPage(1);
    setFilterOptions({
      category: undefined,
      minRating: 0,
      minDiscount: 0,
      featured: false,
      distance: 0,
    });
  }, []);

  const selectGroup = useCallback((group?: string) => {
    setCategoryGroup(group);
    setFilterOptions(prev => ({ ...prev, category: undefined }));
    setPage(1);
  }, []);

  const selectCountry = useCallback((next?: string) => {
    setCountry(next);
    setStateCode(undefined);
    setCity(undefined);
    setPage(1);
  }, []);

  const selectState = useCallback((next?: string) => {
    setStateCode(next);
    setCity(undefined);
    setPage(1);
  }, []);

  const selectCity = useCallback((next?: string) => {
    setCity(next);
    setPage(1);
  }, []);

  const clearBrowse = useCallback(() => {
    setCategoryGroup(undefined);
    setCountry(undefined);
    setStateCode(undefined);
    setCity(undefined);
    setFilterOptions(prev => ({ ...prev, category: undefined }));
    setSearchTerm('');
    setPage(1);
  }, []);

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (groupsData || []).forEach(g => {
      if (g.category_group) counts[g.category_group] = Number(g.count);
    });
    return counts;
  }, [groupsData]);

  return {
    selectedCity,
    searchTerm,
    setSearchTerm: handleSearchChange,
    filterOptions,
    handleFilterChange,
    handleCityChange,
    categories,
    filteredBusinesses: businesses,
    mapData,
    totalBusinesses: totalCount,
    businessCounts,
    isLoading,
    error,
    // Browse by group + place
    categoryGroup,
    selectGroup,
    country,
    selectCountry,
    stateCode,
    selectState,
    city,
    selectCity,
    clearBrowse,
    groupCounts,
    countries: (countriesData || []) as { country: string; count: number }[],
    states: (statesData || []) as { state: string; count: number }[],
    cities: (citiesData || []) as { city: string; state: string; count: number }[],
    // Pagination
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
  };
};
