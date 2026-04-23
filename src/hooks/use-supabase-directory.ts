
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation as useRouterLocation } from 'react-router-dom';
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
  total_count: number;
}

const mapSupabaseToFrontend = (business: SupabaseBusiness): Business => {
  const businessName = business.name || business.business_name || 'Unnamed Business';
  const logoUrl = business.logo_url || '';
  const bannerUrl = getBusinessBanner(business.id, business.banner_url, business.website) || '';
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

export const useSupabaseDirectory = () => {
  const queryClient = useQueryClient();
  const insertCountRef = useRef(0);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const routerLocation = useRouterLocation();

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

  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [page, setPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState<BusinessFilters>({
    category: initialCategory,
    minRating: 0,
    minDiscount: 0,
    featured: false,
    distance: 0,
  });

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
    setPage(1);
  }, [routerLocation.search]);

  // Realtime subscription: auto-refresh directory every 15 new inserts from Kayla
  useEffect(() => {
    const channel = supabase
      .channel('kayla-directory-refresh')
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
    page,
  ], [searchTerm, filterOptions.category, filterOptions.minRating, page]);

  // Fetch paginated businesses from server-side RPC
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const offset = (page - 1) * PAGE_SIZE;
      
      const { data, error } = await supabase.rpc('search_directory_businesses', {
        p_search_term: searchTerm || null,
        p_category: filterOptions.category || null,
        p_min_rating: filterOptions.minRating || null,
        p_limit: PAGE_SIZE,
        p_offset: offset,
      });

      if (error) throw error;
      
      const results = (data || []) as SupabaseBusiness[];
      const totalCount = results.length > 0 ? Number(results[0].total_count) : 0;
      
      console.log(`[Directory] Page ${page}: loaded ${results.length} businesses (${totalCount} total)`);
      
      return { results, totalCount };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
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
    return (mapMarkersData || []).map(m => ({
      id: m.id,
      name: m.business_name,
      lat: m.latitude,
      lng: m.longitude,
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
    // Pagination
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
  };
};
