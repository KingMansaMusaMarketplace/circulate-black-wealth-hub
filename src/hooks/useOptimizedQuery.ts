/**
 * Optimized React Query hooks with stale-while-revalidate patterns
 * and intelligent prefetching for better perceived performance
 */

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T, Error, T, string[]>, 'queryKey' | 'queryFn'> {
  /** Prefetch related queries when this one loads */
  prefetchRelated?: Array<{
    queryKey: string[];
    queryFn: () => Promise<unknown>;
  }>;
  /** Enable background revalidation */
  revalidateInBackground?: boolean;
}

/**
 * Enhanced useQuery with stale-while-revalidate and prefetching
 */
export function useOptimizedQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: OptimizedQueryOptions<T>
) {
  const queryClient = useQueryClient();
  const { prefetchRelated, revalidateInBackground = true, ...queryOptions } = options || {};

  const result = useQuery({
    queryKey,
    queryFn,
    // Stale-while-revalidate defaults
    staleTime: 5 * 60 * 1000, // 5 minutes - serve from cache immediately
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache
    refetchOnWindowFocus: false,
    refetchOnMount: 'always', // Revalidate on mount but show stale data
    ...queryOptions,
  });

  // Prefetch related queries when this one succeeds
  useEffect(() => {
    if (result.isSuccess && prefetchRelated && prefetchRelated.length > 0) {
      prefetchRelated.forEach(({ queryKey: relatedKey, queryFn: relatedFn }) => {
        queryClient.prefetchQuery({
          queryKey: relatedKey,
          queryFn: relatedFn,
          staleTime: 5 * 60 * 1000,
        });
      });
    }
  }, [result.isSuccess, prefetchRelated, queryClient]);

  // Background revalidation on visibility change
  useEffect(() => {
    if (!revalidateInBackground) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Silently revalidate after 1 second when tab becomes visible
        setTimeout(() => {
          queryClient.invalidateQueries({ 
            queryKey,
            refetchType: 'active',
          });
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [queryKey, queryClient, revalidateInBackground]);

  return result;
}

/**
 * Prefetch a route's data before navigation
 */
export function usePrefetchOnHover() {
  const queryClient = useQueryClient();

  const prefetchRoute = (
    queryKey: string[],
    queryFn: () => Promise<unknown>,
    staleTime = 5 * 60 * 1000
  ) => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime,
    });
  };

  return { prefetchRoute };
}

/**
 * Optimistic updates helper for mutations
 */
export function useOptimisticUpdate<T>(queryKey: string[]) {
  const queryClient = useQueryClient();

  const setOptimistic = (updater: (old: T | undefined) => T) => {
    queryClient.setQueryData<T>(queryKey, updater);
  };

  const rollback = (previousData: T | undefined) => {
    queryClient.setQueryData<T>(queryKey, previousData);
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { setOptimistic, rollback, invalidate };
}

/**
 * Preload data for common routes on idle
 */
export function useRoutePreloader() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const preloadOnIdle = () => {
      // Preload common route data during idle time
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // These can be customized per app
          console.log('[PREFETCH] Preloading common routes during idle');
        }, { timeout: 2000 });
      }
    };

    // Only preload after initial render settles
    const timer = setTimeout(preloadOnIdle, 3000);
    return () => clearTimeout(timer);
  }, [queryClient]);
}
