import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Sponsor {
  id: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
  status: string;
}

/**
 * Optimized hook for fetching sponsor data with aggressive caching
 * Sponsor logos change infrequently, so we cache them for 30 minutes
 */
export const useCachedSponsors = (tier?: string) => {
  return useQuery({
    queryKey: ['sponsors', { tier }],
    queryFn: async () => {
      let query = supabase
        .from('corporate_subscriptions')
        .select('*')
        .eq('status', 'active')
        .order('tier', { ascending: false });

      if (tier) {
        query = query.eq('tier', tier);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Sponsor[];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - sponsors rarely change
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache longer
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

/**
 * Hook for fetching featured sponsors with maximum caching
 */
export const useFeaturedSponsors = () => {
  return useQuery({
    queryKey: ['sponsors', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('*')
        .eq('status', 'active')
        .in('tier', ['platinum', 'gold'])
        .order('tier', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Sponsor[];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
};
