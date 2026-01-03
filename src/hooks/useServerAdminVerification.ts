import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminVerificationResult {
  isAdmin: boolean;
  isVerifying: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Server-side admin verification hook.
 * Uses the secure RPC function `is_admin_secure` to verify admin status
 * on the server rather than relying on client-side role checks.
 */
export function useServerAdminVerification(): AdminVerificationResult {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyAdmin = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setIsVerifying(false);
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Call the secure server-side function to verify admin status
      const { data, error: rpcError } = await supabase.rpc('is_admin_secure');

      if (rpcError) {
        console.error('Admin verification error:', rpcError);
        setError('Failed to verify admin status');
        setIsAdmin(false);
      } else {
        setIsAdmin(data === true);
      }
    } catch (err) {
      console.error('Admin verification exception:', err);
      setError('An error occurred while verifying admin status');
      setIsAdmin(false);
    } finally {
      setIsVerifying(false);
    }
  }, [user]);

  useEffect(() => {
    verifyAdmin();
  }, [verifyAdmin]);

  return {
    isAdmin,
    isVerifying,
    error,
    refetch: verifyAdmin,
  };
}
