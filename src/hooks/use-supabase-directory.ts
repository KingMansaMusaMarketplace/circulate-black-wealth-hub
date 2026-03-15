import { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { BusinessFilters } from '@/lib/api/directory/types';
import { getBusinessBanner } from '@/utils/businessBanners';

// Interface matches business_directory view columns (no PII exposed)
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
}

const mapSupabaseToFrontend = (business: SupabaseBusiness): Business => {
  const businessName = business.name || business.business_name || 'Unnamed Business';
  const logoUrl = business.logo_url || '';
  // Use banner fallback for businesses without banners
  const bannerUrl = getBusinessBanner(business.id, business.banner_url) || '';
  // Prefer banner for card image, fall back to logo
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
    phone: '', // Not exposed in public view for privacy
    email: '', // Not exposed in public view for privacy
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
    isFeatured: business.is_verified || false,
    isVerified: business.is_verified || false,
    ownerId: '', // Not exposed in public view for privacy
    createdAt: business.created_at,
    updatedAt: business.updated_at
  };
};

export const useSupabaseDirectory = () => {
  const queryClient = useQueryClient();
  const insertCountRef = useRef(0);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<BusinessFilters>({
    category: undefined,
    minRating: 0,
    minDiscount: 0,
    featured: false,
    distance: 0,
  });

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

  // Fetch businesses from Supabase
  const { data: rawBusinesses = [], isLoading, error } = useQuery({
    queryKey: ['directory-businesses'],
    queryFn: async () => {
      // Use SECURITY DEFINER RPC for reliable anonymous/public directory access
      const pageSize = 500;
      let offset = 0;
      const allBusinesses: SupabaseBusiness[] = [];

      while (true) {
        const { data, error } = await supabase.rpc('get_directory_businesses', {
          p_limit: pageSize,
          p_offset: offset,
        });

        if (error) throw error;

        const batch = (data || []) as SupabaseBusiness[];
        allBusinesses.push(...batch);

        if (batch.length < pageSize) break;
        offset += pageSize;

        // Safety cap to prevent accidental infinite loops
        if (offset >= 200000) break;
      }

      return allBusinesses;
    },
    staleTime: 30 * 1000, // 30 seconds — directory updates frequently via auto-discover
    gcTime: 5 * 60 * 1000,
  });

  // Map to frontend Business type
  const businesses = useMemo(() => {
    return rawBusinesses.map(mapSupabaseToFrontend);
  }, [rawBusinesses]);

  // Filter businesses based on city
  const cityBusinesses = useMemo(() => {
    if (selectedCity === 'all') return businesses;
    
    const cityName = selectedCity.replace('-', ' ').toLowerCase();
    return businesses.filter(business => 
      business.city.toLowerCase().includes(cityName)
    );
  }, [selectedCity, businesses]);

  // Filter businesses based on search and filters
  const filteredBusinesses = useMemo(() => {
    let filtered = cityBusinesses;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchLower) ||
        business.category.toLowerCase().includes(searchLower) ||
        business.description?.toLowerCase().includes(searchLower) ||
        business.address.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filterOptions.category && filterOptions.category !== 'all') {
      filtered = filtered.filter(business => business.category === filterOptions.category);
    }

    // Apply rating filter
    if (filterOptions.minRating && filterOptions.minRating > 0) {
      filtered = filtered.filter(business => business.rating >= filterOptions.minRating!);
    }

    // Apply featured filter
    if (filterOptions.featured) {
      filtered = filtered.filter(business => business.isFeatured);
    }

    return filtered;
  }, [cityBusinesses, searchTerm, filterOptions]);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(businesses.map(business => business.category))];
    return uniqueCategories.filter(Boolean).sort();
  }, [businesses]);

  // Convert businesses to map data format
  const mapData = useMemo(() => {
    return filteredBusinesses.map(business => ({
      id: business.id,
      name: business.name,
      lat: business.lat,
      lng: business.lng,
      category: business.category,
      rating: business.rating,
      discount: business.discount,
    }));
  }, [filteredBusinesses]);

  const handleFilterChange = (newFilters: Partial<BusinessFilters>) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    setFilterOptions({
      category: undefined,
      minRating: 0,
      minDiscount: 0,
      featured: false,
      distance: 0,
    });
  };

  return {
    selectedCity,
    searchTerm,
    setSearchTerm,
    filterOptions,
    handleFilterChange,
    handleCityChange,
    categories,
    filteredBusinesses,
    mapData,
    totalBusinesses: businesses.length,
    isLoading,
    error,
  };
};
