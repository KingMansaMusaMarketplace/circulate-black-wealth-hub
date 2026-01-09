import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminVerificationResult {
  isAdmin: boolean;
  isVerifying: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Server-side admin verification hook with caching.
 * Uses TanStack Query to cache the result and prevent duplicate requests.
 */
export function useServerAdminVerification(): AdminVerificationResult {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-verification', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase.rpc('is_admin_secure');
      if (error) throw error;
      return data === true;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 1,
  });

  return {
    isAdmin: data ?? false,
    isVerifying: isLoading,
    error: error ? 'Failed to verify admin status' : null,
    refetch: async () => { await refetch(); },
  };
}
