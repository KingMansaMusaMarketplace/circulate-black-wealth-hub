
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

export interface LoyaltyPoints {
  id: string;
  customer_id: string;
  business_id: string;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface PointsHistory {
  id: string;
  points: number;
  type: 'earned' | 'redeemed';
  date: string;
  business_name?: string;
}

export interface RedeemedReward {
  id: string;
  reward_id: string;
  customer_id: string;
  points_used: number;
  redemption_date: string;
  title: string;
}

export interface LoyaltySummary {
  totalPoints: number;
  totalBusinesses: number;
  recentTransactions: any[];
}

export const useLoyalty = () => {
  const [summary, setSummary] = useState<LoyaltySummary>({
    totalPoints: 0,
    totalBusinesses: 0,
    recentTransactions: []
  });
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get loyalty points
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('customer_id', user.id);

      if (loyaltyError) {
        console.error('Error fetching loyalty data:', loyaltyError);
        return;
      }

      const calculatedTotalPoints = loyaltyData?.reduce((sum, record) => sum + (record.points || 0), 0) || 0;
      const totalBusinesses = loyaltyData?.length || 0;

      setSummary({
        totalPoints: calculatedTotalPoints,
        totalBusinesses,
        recentTransactions: []
      });

      setLoyaltyPoints(loyaltyData || []);

      // Mock points history for now
      setPointsHistory([
        {
          id: '1',
          points: 25,
          type: 'earned',
          date: new Date().toISOString(),
          business_name: 'Sample Business'
        }
      ]);

      // Mock redeemed rewards for now
      setRedeemedRewards([]);
    } catch (error) {
      console.error('Error refreshing loyalty data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    summary,
    loyaltyPoints: summary.totalPoints,
    pointsHistory,
    isLoading: loading,
    loading,
    nextRewardThreshold: 500,
    currentTier: 'Bronze',
    redeemedRewards,
    refreshData
  };
};
