import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const FALLBACK_COUNT = 46000;

/**
 * Live count of verified businesses in the directory.
 * Single source of truth for every "XX,000+ Verified Businesses" number on the site.
 */
export function useLiveBusinessCount() {
  const { data, isLoading } = useQuery({
    queryKey: ['platform-stats-business-count'],
    queryFn: async () => {
      const { data } = await supabase.rpc('get_platform_stats');
      const stats = data as { total_businesses?: number } | null;
      return stats?.total_businesses ?? null;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const count = data ?? FALLBACK_COUNT;

  return {
    count,
    isLoading,
    /** Exact live number, e.g. "46,802" */
    formatted: count.toLocaleString(),
    /** Rounded down to nearest thousand with a plus, e.g. "46,000+" */
    rounded: `${(Math.floor(count / 1000) * 1000).toLocaleString()}+`,
  };
}
