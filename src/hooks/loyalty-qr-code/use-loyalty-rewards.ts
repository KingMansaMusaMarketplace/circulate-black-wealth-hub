
import { useState } from 'react';
import { useLoyalty } from '@/hooks/use-loyalty';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface UseLoyaltyRewardsOptions {
  businessId?: string;
}

export const useLoyaltyRewards = (options: UseLoyaltyRewardsOptions = {}) => {
  const [loyaltyPoints, setLoyaltyPoints] = useState<any[]>([]);
  const { user } = useAuth();
  const { summary, refreshData } = useLoyalty();
  
  const totalPoints = summary.totalPoints;
  
  const refreshLoyaltyData = async () => {
    await refreshData();
  };
  
  const redeemReward = async (rewardId: string, pointsCost: number) => {
    if (!user) {
      toast.error('You must be logged in to redeem rewards');
      return false;
    }
    
    if (totalPoints < pointsCost) {
      toast.error('Insufficient points for this reward');
      return false;
    }
    
    try {
      // Simulate reward redemption
      toast.success(`Reward redeemed for ${pointsCost} points!`);
      await refreshLoyaltyData();
      return true;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to redeem reward');
      return false;
    }
  };
  
  return {
    totalPoints,
    loyaltyPoints,
    refreshLoyaltyData,
    redeemReward
  };
};
