import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CoalitionPoints {
  id: string;
  customer_id: string;
  points: number;
  lifetime_earned: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tier_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoalitionTransaction {
  id: string;
  customer_id: string;
  source_business_id: string | null;
  redeem_business_id: string | null;
  transaction_type: 'earn' | 'redeem' | 'transfer' | 'bonus' | 'referral';
  points: number;
  description: string | null;
  created_at: string;
  source_business?: { business_name: string } | null;
  redeem_business?: { business_name: string } | null;
}

export interface CoalitionReward {
  id: string;
  title: string;
  description: string | null;
  points_cost: number;
  reward_type: 'discount' | 'product' | 'service' | 'experience';
  discount_percentage: number | null;
  discount_amount: number | null;
  valid_at_all_businesses: boolean;
  expires_at: string | null;
  is_active: boolean;
}

export interface CoalitionMember {
  id: string;
  business_id: string;
  is_active: boolean;
  joined_at: string;
  business?: {
    business_name: string;
    logo_url: string | null;
    category: string | null;
  };
}

export interface CoalitionStats {
  total_members: number;
  total_customers: number;
  total_points_circulated: number;
  total_points_redeemed: number;
  platinum_members: number;
  gold_members: number;
  silver_members: number;
  bronze_members: number;
}

const TIER_INFO = {
  bronze: { name: 'Bronze', minPoints: 0, maxPoints: 999, multiplier: 1.0, color: 'amber' },
  silver: { name: 'Silver', minPoints: 1000, maxPoints: 4999, multiplier: 1.25, color: 'slate' },
  gold: { name: 'Gold', minPoints: 5000, maxPoints: 14999, multiplier: 1.5, color: 'yellow' },
  platinum: { name: 'Platinum', minPoints: 15000, maxPoints: Infinity, multiplier: 2.0, color: 'purple' },
};

export const useCoalition = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState<CoalitionPoints | null>(null);
  const [transactions, setTransactions] = useState<CoalitionTransaction[]>([]);
  const [rewards, setRewards] = useState<CoalitionReward[]>([]);
  const [members, setMembers] = useState<CoalitionMember[]>([]);
  const [stats, setStats] = useState<CoalitionStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCoalitionData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch user's coalition points
      const { data: pointsData } = await supabase
        .from('coalition_points')
        .select('*')
        .eq('customer_id', user.id)
        .single();

      if (pointsData) {
        setPoints(pointsData as CoalitionPoints);
      }

      // Fetch recent transactions
      const { data: transactionsData } = await supabase
        .from('coalition_transactions')
        .select(`
          *,
          source_business:source_business_id(business_name),
          redeem_business:redeem_business_id(business_name)
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (transactionsData) {
        setTransactions(transactionsData as unknown as CoalitionTransaction[]);
      }

      // Fetch active rewards
      const { data: rewardsData } = await supabase
        .from('coalition_rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_cost', { ascending: true });

      if (rewardsData) {
        setRewards(rewardsData as CoalitionReward[]);
      }

      // Fetch coalition members
      const { data: membersData } = await supabase
        .from('coalition_members')
        .select(`
          *,
          business:business_id(business_name, logo_url, category)
        `)
        .eq('is_active', true)
        .limit(50);

      if (membersData) {
        setMembers(membersData as unknown as CoalitionMember[]);
      }

      // Fetch coalition stats
      const { data: statsData } = await supabase.rpc('get_coalition_stats');
      if (statsData) {
        setStats(statsData as CoalitionStats);
      }
    } catch (error) {
      console.error('Error fetching coalition data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCoalitionData();
  }, [fetchCoalitionData]);

  const redeemReward = async (rewardId: string) => {
    if (!user || !points) {
      toast.error('Please log in to redeem rewards');
      return null;
    }

    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      toast.error('Reward not found');
      return null;
    }

    if (points.points < reward.points_cost) {
      toast.error('Insufficient points');
      return null;
    }

    try {
      // Generate redemption code
      const redemptionCode = `CM-${Date.now().toString(36).toUpperCase()}`;

      // Create redemption record
      const { data: redemption, error: redemptionError } = await supabase
        .from('coalition_redemptions')
        .insert({
          customer_id: user.id,
          reward_id: rewardId,
          points_spent: reward.points_cost,
          redemption_code: redemptionCode,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (redemptionError) throw redemptionError;

      // Deduct points
      const { error: updateError } = await supabase
        .from('coalition_points')
        .update({ 
          points: points.points - reward.points_cost,
          updated_at: new Date().toISOString()
        })
        .eq('customer_id', user.id);

      if (updateError) throw updateError;

      // Record transaction
      await supabase.from('coalition_transactions').insert({
        customer_id: user.id,
        transaction_type: 'redeem',
        points: -reward.points_cost,
        description: `Redeemed: ${reward.title}`,
      });

      toast.success(`Reward redeemed! Code: ${redemptionCode}`);
      await fetchCoalitionData();
      return redemption;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to redeem reward');
      return null;
    }
  };

  const getTierInfo = (tier: string) => TIER_INFO[tier as keyof typeof TIER_INFO] || TIER_INFO.bronze;

  const getNextTier = (currentTier: string) => {
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tiers.indexOf(currentTier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const getProgressToNextTier = () => {
    if (!points) return { progress: 0, pointsNeeded: 1000 };
    
    const tierInfo = getTierInfo(points.tier);
    const nextTierName = getNextTier(points.tier);
    
    if (!nextTierName) return { progress: 100, pointsNeeded: 0 };
    
    const nextTierInfo = getTierInfo(nextTierName);
    const pointsInCurrentTier = points.lifetime_earned - tierInfo.minPoints;
    const pointsForNextTier = nextTierInfo.minPoints - tierInfo.minPoints;
    
    return {
      progress: Math.min((pointsInCurrentTier / pointsForNextTier) * 100, 100),
      pointsNeeded: nextTierInfo.minPoints - points.lifetime_earned,
    };
  };

  return {
    points,
    transactions,
    rewards,
    members,
    stats,
    loading,
    redeemReward,
    refreshData: fetchCoalitionData,
    getTierInfo,
    getNextTier,
    getProgressToNextTier,
    TIER_INFO,
  };
};
