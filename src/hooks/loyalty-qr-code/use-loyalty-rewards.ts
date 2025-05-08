
import { useState, useEffect } from 'react';
import { useLoyalty } from '@/hooks/use-loyalty';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  businessName?: string;
  expiresAt?: string;
}

interface UseLoyaltyRewardsOptions {
  autoRefresh?: boolean;
  businessId?: string;
}

export const useLoyaltyRewards = (options: UseLoyaltyRewardsOptions = {}) => {
  const [loyaltyPoints, setLoyaltyPoints] = useState<Array<{
    businessId: string;
    businessName: string;
    points: number;
  }>>([]);
  const { user } = useAuth();
  const { 
    summary, 
    refreshData, 
    redeemReward,
    availableRewards
  } = useLoyalty();
  
  // Format the available rewards into a more useful structure
  const formattedRewards: LoyaltyReward[] = availableRewards.map(reward => ({
    id: reward.id,
    title: reward.title,
    description: reward.description || '',
    pointsCost: reward.points_cost,
    category: reward.category || 'General',
    businessName: reward.business_name,
    expiresAt: reward.expiration_date
  }));

  // Update the loyaltyPoints whenever there's a change in the summary
  useEffect(() => {
    if (summary && summary.businessPoints) {
      const formattedPoints = summary.businessPoints.map(bp => ({
        businessId: bp.business_id,
        businessName: bp.business_name || 'Business',
        points: bp.points
      }));

      setLoyaltyPoints(formattedPoints);
    }
  }, [summary]);

  // Handle reward redemption with proper feedback
  const handleRedeemReward = async (rewardId: string, pointsCost: number) => {
    if (!user) {
      toast.error('You must be logged in to redeem rewards');
      return false;
    }
    
    try {
      const result = await redeemReward(rewardId, pointsCost);
      
      if (result.success) {
        toast.success('Reward redeemed successfully!');
        refreshData();
        return true;
      } else {
        toast.error(result.message || 'Failed to redeem reward');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while redeeming the reward');
      return false;
    }
  };

  return {
    totalPoints: summary.totalPoints || 0,
    loyaltyPoints,
    availableRewards: formattedRewards,
    redeemReward: handleRedeemReward,
    refreshLoyaltyData: refreshData
  };
};
