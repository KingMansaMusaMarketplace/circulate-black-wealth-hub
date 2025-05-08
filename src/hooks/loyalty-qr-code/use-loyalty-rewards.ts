
import { useLoyalty } from '@/hooks/use-loyalty';

interface UseLoyaltyRewardsOptions {
  autoRefresh?: boolean;
}

export const useLoyaltyRewards = (options: UseLoyaltyRewardsOptions = {}) => {
  const { 
    summary, 
    refreshData, 
    redeemReward 
  } = useLoyalty();
  
  return {
    totalPoints: summary.totalPoints,
    loyaltyPoints: [], // We'll replace this with actual business points data
    redeemReward,
    refreshLoyaltyData: refreshData
  };
};
