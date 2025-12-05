import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Sponsor {
  id: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
  status: string;
  is_visible: boolean;
  logo_approved: boolean;
  display_priority: number;
}

/**
 * Optimized hook for fetching sponsor data with aggressive caching
 * Only returns sponsors that are visible AND have approved logos
 */
export const useCachedSponsors = (tier?: string) => {
  return useQuery({
    queryKey: ['sponsors', { tier }],
    queryFn: async () => {
      let query = supabase
        .from('corporate_subscriptions')
        .select('*')
        .eq('status', 'active')
        .eq('is_visible', true)
        .eq('logo_approved', true)
        .order('display_priority', { ascending: false })
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
 * Only returns visible, approved platinum/gold sponsors
 */
export const useFeaturedSponsors = () => {
  return useQuery({
    queryKey: ['sponsors', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('*')
        .eq('status', 'active')
        .eq('is_visible', true)
        .eq('logo_approved', true)
        .in('tier', ['platinum', 'gold'])
        .order('display_priority', { ascending: false })
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