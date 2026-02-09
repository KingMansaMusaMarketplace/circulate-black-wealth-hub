import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo, useCallback } from 'react';

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string | null;
  is_enabled: boolean;
  rollout_percentage: number;
  target_user_types: string[] | null;
  created_at: string;
  updated_at: string;
}

interface UseFeatureFlagsReturn {
  flags: FeatureFlag[];
  isLoading: boolean;
  error: Error | null;
  isEnabled: (flagKey: string) => boolean;
  getFlag: (flagKey: string) => FeatureFlag | undefined;
  refetch: () => void;
}

/**
 * Hook for checking feature flags at runtime
 * 
 * Features:
 * - Fetches all active feature flags from the database
 * - Handles rollout percentage logic (deterministic based on user ID)
 * - Checks user type targeting
 * - Caches results using TanStack Query
 * 
 * Usage:
 * ```tsx
 * const { isEnabled } = useFeatureFlags();
 * if (isEnabled('new_checkout_flow')) {
 *   // Show new checkout
 * }
 * ```
 */
export function useFeatureFlags(): UseFeatureFlagsReturn {
  const { user } = useAuth();

  const { data: flags = [], isLoading, error, refetch } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: async (): Promise<FeatureFlag[]> => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching feature flags:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Generate a deterministic hash for rollout percentage
  const getUserRolloutValue = useCallback((flagKey: string): number => {
    const userId = user?.id || 'anonymous';
    const combined = `${userId}:${flagKey}`;
    
    // Simple hash function to get a value between 0-100
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash) % 100;
  }, [user?.id]);

  // Get user type for targeting
  const userType = useMemo(() => {
    if (!user) return 'anonymous';
    
    const metadata = user.user_metadata;
    if (metadata?.user_type) return metadata.user_type;
    if (metadata?.is_business) return 'business';
    if (metadata?.is_admin) return 'admin';
    
    return 'customer';
  }, [user]);

  // Check if a flag is enabled for the current user
  const isEnabled = useCallback((flagKey: string): boolean => {
    const flag = flags.find(f => f.key === flagKey);
    
    // Flag not found - default to disabled
    if (!flag) {
      return false;
    }

    // Flag globally disabled
    if (!flag.is_enabled) {
      return false;
    }

    // Check user type targeting
    if (flag.target_user_types && flag.target_user_types.length > 0) {
      if (!flag.target_user_types.includes(userType)) {
        return false;
      }
    }

    // Check rollout percentage
    if (flag.rollout_percentage < 100) {
      const userRolloutValue = getUserRolloutValue(flagKey);
      if (userRolloutValue >= flag.rollout_percentage) {
        return false;
      }
    }

    return true;
  }, [flags, userType, getUserRolloutValue]);

  // Get a specific flag by key
  const getFlag = useCallback((flagKey: string): FeatureFlag | undefined => {
    return flags.find(f => f.key === flagKey);
  }, [flags]);

  return {
    flags,
    isLoading,
    error: error as Error | null,
    isEnabled,
    getFlag,
    refetch,
  };
}

export default useFeatureFlags;
