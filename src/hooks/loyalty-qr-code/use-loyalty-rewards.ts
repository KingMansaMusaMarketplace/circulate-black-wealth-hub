import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Reward {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  category: string;
  expires_at?: string;
  business_id: string;
  is_active: boolean;
}

export const useLoyaltyRewards = () => {
  const { user } = useAuth();
  const [totalPoints, setTotalPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLoyaltyData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch user's total loyalty points
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from('loyalty_points')
        .select('points')
        .eq('customer_id', user.id);

      if (loyaltyError) {
        console.error('Error fetching loyalty points:', loyaltyError);
      } else {
        const total = loyaltyData?.reduce((sum, record) => sum + (record.points || 0), 0) || 0;
        setTotalPoints(total);
      }

      // Fetch available rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_cost', { ascending: true });

      if (rewardsError) {
        console.error('Error fetching rewards:', rewardsError);
      } else {
        setRewards(rewardsData || []);
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLoyaltyData();
  }, [fetchLoyaltyData]);

  // Redeem a reward
  const redeemReward = async (rewardId: string, pointsCost: number): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to redeem rewards');
      return false;
    }

    if (totalPoints < pointsCost) {
      toast.error('Not enough points to redeem this reward');
      return false;
    }

    try {
      // Record the redemption
      const { error: redemptionError } = await supabase
        .from('redeemed_rewards')
        .insert({
          customer_id: user.id,
          reward_id: rewardId,
          points_used: pointsCost,
          redemption_date: new Date().toISOString()
        });

      if (redemptionError) {
        console.error('Error recording redemption:', redemptionError);
        toast.error('Failed to redeem reward');
        return false;
      }

      // Update points (deduct from first available loyalty_points record)
      const { data: loyaltyRecords, error: fetchError } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('customer_id', user.id)
        .order('points', { ascending: false });

      if (fetchError || !loyaltyRecords?.length) {
        console.error('Error fetching loyalty records:', fetchError);
        return false;
      }

      let remainingToDeduct = pointsCost;
      for (const record of loyaltyRecords) {
        if (remainingToDeduct <= 0) break;

        const deduction = Math.min(record.points, remainingToDeduct);
        const newPoints = record.points - deduction;

        await supabase
          .from('loyalty_points')
          .update({ points: newPoints })
          .eq('id', record.id);

        remainingToDeduct -= deduction;
      }

      // Update local state
      setTotalPoints(prev => prev - pointsCost);
      toast.success('Reward redeemed successfully!');
      return true;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to redeem reward');
      return false;
    }
  };

  return {
    totalPoints,
    rewards,
    loading,
    redeemReward,
    refreshData: fetchLoyaltyData,
  };
};
