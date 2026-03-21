import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WealthMetrics {
  total_spent: number;
  transaction_count: number;
  businesses_supported: number;
  sponsor_count: number;
  sponsor_investment: number;
  economic_impact: number;
  multiplier: number;
}

const FALLBACK_METRICS: WealthMetrics = {
  total_spent: 0,
  transaction_count: 0,
  businesses_supported: 0,
  sponsor_count: 0,
  sponsor_investment: 0,
  economic_impact: 0,
  multiplier: 6.0
};

export const useWealthMetrics = () => {
  const [metrics, setMetrics] = useState<WealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      // Fetch verified wealth stats first
      const { data: wealthStats } = await supabase
        .from('community_wealth_stats')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .maybeSingle();

      // Also try the RPC for sponsor/business counts
      const { data: rpcData } = await supabase.rpc('get_community_wealth_metrics');

      const rpc = rpcData as WealthMetrics | null;

      setMetrics({
        total_spent: wealthStats?.total_verified_spending ?? rpc?.total_spent ?? 0,
        transaction_count: wealthStats?.verified_transaction_count ?? rpc?.transaction_count ?? 0,
        businesses_supported: rpc?.businesses_supported ?? 0,
        sponsor_count: rpc?.sponsor_count ?? 0,
        sponsor_investment: rpc?.sponsor_investment ?? 0,
        economic_impact: wealthStats?.economic_impact ?? rpc?.economic_impact ?? 0,
        multiplier: 6.0,
      });
    } catch (err) {
      console.error('Error fetching wealth metrics:', err);
      setError('Failed to load metrics');
      setMetrics(FALLBACK_METRICS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Real-time subscription for instant ticker updates
    const channel = supabase
      .channel('wealth-ticker-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'community_wealth_stats',
        },
        (payload) => {
          const row = payload.new as any;
          setMetrics((prev) => ({
            ...(prev || FALLBACK_METRICS),
            total_spent: row.total_verified_spending ?? prev?.total_spent ?? 0,
            transaction_count: row.verified_transaction_count ?? prev?.transaction_count ?? 0,
            economic_impact: row.economic_impact ?? prev?.economic_impact ?? 0,
          }));
        }
      )
      .subscribe();

    // Fallback polling every 60s (less frequent since we have realtime)
    const interval = setInterval(fetchMetrics, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return { metrics, loading, error, refetch: fetchMetrics };
};
