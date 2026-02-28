import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RideImpact {
  total_rides: number;
  total_fare_spent: number;
  driver_earnings_supported: number;
  community_businesses_visited: number;
  community_credits_earned: number;
  co2_saved_kg: number;
}

const DEFAULT_IMPACT: RideImpact = {
  total_rides: 0,
  total_fare_spent: 0,
  driver_earnings_supported: 0,
  community_businesses_visited: 0,
  community_credits_earned: 0,
  co2_saved_kg: 0,
};

export function useNoireRideImpact() {
  const { user } = useAuth();
  const [impact, setImpact] = useState<RideImpact>(DEFAULT_IMPACT);
  const [loading, setLoading] = useState(true);

  const fetchImpact = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('noire_ride_impact')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) setImpact(data as any);
    } catch (err) {
      console.error('Error fetching ride impact:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchImpact(); }, [fetchImpact]);

  return { impact, loading, refetch: fetchImpact };
}
