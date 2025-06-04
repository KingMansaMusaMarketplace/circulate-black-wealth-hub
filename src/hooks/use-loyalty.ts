
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LoyaltySummary {
  totalPoints: number;
  businessCount: number;
  recentTransactions: any[];
}

export const useLoyalty = () => {
  const [summary, setSummary] = useState<LoyaltySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchLoyaltyData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch loyalty points
      const { data: loyaltyPoints, error: loyaltyError } = await supabase
        .from('loyalty_points')
        .select('points, business_id')
        .eq('customer_id', user.id);

      if (loyaltyError) throw loyaltyError;

      // Calculate totals
      const totalPoints = loyaltyPoints?.reduce((sum, lp) => sum + lp.points, 0) || 0;
      const businessCount = loyaltyPoints?.length || 0;

      // Fetch recent transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (transactionsError) throw transactionsError;

      setSummary({
        totalPoints,
        businessCount,
        recentTransactions: transactions || []
      });

    } catch (err: any) {
      console.error('Error fetching loyalty data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshData = useCallback(() => {
    return fetchLoyaltyData();
  }, [fetchLoyaltyData]);

  useEffect(() => {
    fetchLoyaltyData();
  }, [fetchLoyaltyData]);

  return {
    summary,
    loading,
    error,
    refreshData
  };
};
