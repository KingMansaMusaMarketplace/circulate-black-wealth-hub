import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Business {
  id: string;
  business_name: string;
  name: string;
  description: string | null;
  category: string | null;
  city: string | null;
  state: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_verified: boolean;
  average_rating: number | null;
  review_count: number;
}

interface BusinessFilters {
  category?: string;
  city?: string;
  state?: string;
  searchTerm?: string;
}

/**
 * Optimized hook for business directory with smart caching
 * Business listings are cached based on filter criteria
 */
export const useCachedBusinesses = (filters?: BusinessFilters, limit = 20) => {
  return useQuery({
    queryKey: ['businesses', 'directory', filters, limit],
    queryFn: async () => {
      let query = supabase
        .from('businesses')
        .select('id, business_name, name, description, category, city, state, logo_url, banner_url, is_verified, average_rating, review_count')
        .eq('is_verified', true)
        .order('average_rating', { ascending: false, nullsFirst: false })
        .order('review_count', { ascending: false })
        .limit(limit);

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.city) {
        query = query.eq('city', filters.city);
      }

      if (filters?.state) {
        query = query.eq('state', filters.state);
      }

      if (filters?.searchTerm) {
        query = query.or(`business_name.ilike.%${filters.searchTerm}%,name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Business[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - business data changes moderately
    gcTime: 20 * 60 * 1000, // 20 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

/**
 * Hook for fetching a single business with caching
 */
export const useCachedBusiness = (businessId?: string) => {
  return useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      if (!businessId) throw new Error('Business ID is required');

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!businessId,
  });
};

/**
 * Hook for fetching featured/top-rated businesses with aggressive caching
 */
export const useFeaturedBusinesses = (limit = 10) => {
  return useQuery({
    queryKey: ['businesses', 'featured', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, business_name, name, logo_url, banner_url, category, average_rating, review_count, city, state')
        .eq('is_verified', true)
        .gte('average_rating', 4)
        .order('review_count', { ascending: false })
        .order('average_rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - featured businesses rarely change
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
};
