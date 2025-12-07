
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
      // Fetch loyalty points from database
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

      setLoyaltyPoints(loyaltyData || []);

      // Fetch QR scans for points history
      const { data: scansData, error: scansError } = await supabase
        .from('qr_scans')
        .select(`
          id,
          scanned_at,
          points_earned,
          business_id,
          businesses (
            business_name
          )
        `)
        .eq('customer_id', user.id)
        .order('scanned_at', { ascending: false })
        .limit(20);

      if (scansError) {
        console.warn('Error fetching scans history:', scansError);
      }

      // Fetch transactions for additional history
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          id,
          created_at,
          points_earned,
          points_redeemed,
          transaction_type,
          business_id,
          businesses (
            business_name
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (transactionsError) {
        console.warn('Error fetching transactions:', transactionsError);
      }

      // Build points history from scans and transactions
      const history: PointsHistory[] = [];

      // Add scans to history
      if (scansData) {
        scansData.forEach(scan => {
          history.push({
            id: `scan-${scan.id}`,
            points: scan.points_earned || 0,
            type: 'earned',
            date: scan.scanned_at,
            business_name: (scan.businesses as any)?.business_name || 'Unknown Business'
          });
        });
      }

      // Add transactions to history
      if (transactionsData) {
        transactionsData.forEach(tx => {
          if (tx.points_earned && tx.points_earned > 0) {
            history.push({
              id: `tx-earn-${tx.id}`,
              points: tx.points_earned,
              type: 'earned',
              date: tx.created_at,
              business_name: (tx.businesses as any)?.business_name || 'Unknown Business'
            });
          }
          if (tx.points_redeemed && tx.points_redeemed > 0) {
            history.push({
              id: `tx-redeem-${tx.id}`,
              points: tx.points_redeemed,
              type: 'redeemed',
              date: tx.created_at,
              business_name: (tx.businesses as any)?.business_name || 'Unknown Business'
            });
          }
        });
      }

      // Sort by date
      history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPointsHistory(history.slice(0, 20));

      // Fetch redeemed rewards
      const { data: redemptionsData, error: redemptionsError } = await supabase
        .from('redeemed_rewards')
        .select(`
          id,
          reward_id,
          customer_id,
          redeemed_at,
          rewards (
            title,
            points_cost
          )
        `)
        .eq('customer_id', user.id)
        .order('redeemed_at', { ascending: false })
        .limit(10);

      if (redemptionsError) {
        console.warn('Error fetching redemptions:', redemptionsError);
      }

      if (redemptionsData) {
        setRedeemedRewards(redemptionsData.map(r => ({
          id: r.id,
          reward_id: r.reward_id,
          customer_id: r.customer_id,
          points_used: (r.rewards as any)?.points_cost || 0,
          redemption_date: r.redeemed_at,
          title: (r.rewards as any)?.title || 'Reward'
        })));
      }

      // Calculate tier based on total points
      let currentTier = 'Bronze';
      let nextRewardThreshold = 500;
      
      if (calculatedTotalPoints >= 5000) {
        currentTier = 'Platinum';
        nextRewardThreshold = 10000;
      } else if (calculatedTotalPoints >= 2000) {
        currentTier = 'Gold';
        nextRewardThreshold = 5000;
      } else if (calculatedTotalPoints >= 500) {
        currentTier = 'Silver';
        nextRewardThreshold = 2000;
      }

      setSummary({
        totalPoints: calculatedTotalPoints,
        totalBusinesses,
        recentTransactions: history.slice(0, 5)
      });
    } catch (error) {
      console.error('Error refreshing loyalty data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Calculate tier based on points
  const calculatedTier = summary.totalPoints >= 5000 ? 'Platinum' 
    : summary.totalPoints >= 2000 ? 'Gold' 
    : summary.totalPoints >= 500 ? 'Silver' 
    : 'Bronze';

  const calculatedThreshold = summary.totalPoints >= 5000 ? 10000
    : summary.totalPoints >= 2000 ? 5000
    : summary.totalPoints >= 500 ? 2000
    : 500;

  return {
    summary,
    loyaltyPoints: summary.totalPoints,
    pointsHistory,
    isLoading: loading,
    loading,
    nextRewardThreshold: calculatedThreshold,
    currentTier: calculatedTier,
    redeemedRewards,
    refreshData
  };
};
