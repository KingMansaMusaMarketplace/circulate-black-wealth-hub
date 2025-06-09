
import { useState, useEffect } from 'react';
import { useLoyalty } from '@/hooks/use-loyalty';

interface UseLoyaltyRewardsOptions {
  businessId?: string;
}

export const useLoyaltyRewards = (options: UseLoyaltyRewardsOptions = {}) => {
  const { summary, refreshData } = useLoyalty();
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    setLoyaltyPoints(summary.totalPoints);
  }, [summary]);

  const redeemReward = async (rewardId: string, pointsCost: number) => {
    // Implementation for redeeming rewards
    console.log('Redeeming reward:', rewardId, 'for', pointsCost, 'points');
    // This would typically call an API to redeem the reward
    await refreshData();
  };

  const refreshLoyaltyData = async () => {
    await refreshData();
  };

  return {
    totalPoints: summary.totalPoints,
    loyaltyPoints,
    refreshLoyaltyData,
    redeemReward
  };
};
