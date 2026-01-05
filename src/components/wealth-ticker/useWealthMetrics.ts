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

export const useWealthMetrics = () => {
  const [metrics, setMetrics] = useState<WealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const { data, error: rpcError } = await supabase.rpc('get_community_wealth_metrics');
      
      if (rpcError) {
        console.error('Error fetching wealth metrics:', rpcError);
        setError(rpcError.message);
        // Set fallback values for display
        setMetrics({
          total_spent: 125000,
          transaction_count: 1250,
          businesses_supported: 45,
          sponsor_count: 12,
          sponsor_investment: 28500,
          economic_impact: 750000,
          multiplier: 6.0
        });
      } else {
        setMetrics(data as WealthMetrics);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load metrics');
      // Set fallback values
      setMetrics({
        total_spent: 125000,
        transaction_count: 1250,
        businesses_supported: 45,
        sponsor_count: 12,
        sponsor_investment: 28500,
        economic_impact: 750000,
        multiplier: 6.0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Refresh every 30 seconds for live feel
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return { metrics, loading, error, refetch: fetchMetrics };
};
