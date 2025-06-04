
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LoyaltySummary {
  totalPoints: number;
  businessCount: number;
  recentTransactions: any[];
  businessesVisited?: number;
}

interface LoyaltyPoint {
  businessName: string;
  points: number;
  businessId: string;
}

interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  expiresAt?: string;
}

interface PointsHistoryEntry {
  id: string;
  date: string;
  points: number;
  type: 'earned' | 'redeemed';
  businessName: string;
}

export const useLoyalty = () => {
  const [summary, setSummary] = useState<LoyaltySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<any[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryEntry[]>([]);
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
      const { data: loyaltyPointsData, error: loyaltyError } = await supabase
        .from('loyalty_points')
        .select('points, business_id, businesses(business_name)')
        .eq('customer_id', user.id);

      if (loyaltyError) throw loyaltyError;

      // Calculate totals
      const totalPoints = loyaltyPointsData?.reduce((sum, lp) => sum + lp.points, 0) || 0;
      const businessCount = loyaltyPointsData?.length || 0;

      setLoyaltyPoints(totalPoints);

      // Fetch recent transactions for points history
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*, businesses(business_name)')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;

      // Transform transactions to points history
      const history: PointsHistoryEntry[] = transactions?.map(t => ({
        id: t.id,
        date: t.created_at,
        points: t.points_earned > 0 ? t.points_earned : t.points_redeemed,
        type: t.points_earned > 0 ? 'earned' : 'redeemed',
        businessName: t.businesses?.business_name || 'Unknown Business'
      })) || [];

      setPointsHistory(history);

      // Fetch available rewards (mock data for now)
      const mockRewards: LoyaltyReward[] = [
        {
          id: '1',
          title: '$10 Off Purchase',
          description: 'Get $10 off your next purchase of $50 or more',
          pointsCost: 100,
          category: 'Discount',
          expiresAt: '2024-12-31'
        },
        {
          id: '2',
          title: 'Free Coffee',
          description: 'Redeem for a free coffee at participating locations',
          pointsCost: 50,
          category: 'Food & Drink'
        }
      ];

      setAvailableRewards(mockRewards);

      setSummary({
        totalPoints,
        businessCount,
        recentTransactions: transactions || [],
        businessesVisited: businessCount
      });

    } catch (err: any) {
      console.error('Error fetching loyalty data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const redeemReward = useCallback(async (rewardId: string) => {
    // Implementation for redeeming rewards
    console.log('Redeeming reward:', rewardId);
    return Promise.resolve();
  }, []);

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
    refreshData,
    loyaltyPoints,
    availableRewards,
    redeemReward,
    redeemedRewards,
    pointsHistory,
    isLoading: loading,
    nextRewardThreshold: 500,
    currentTier: 'Bronze'
  };
};
