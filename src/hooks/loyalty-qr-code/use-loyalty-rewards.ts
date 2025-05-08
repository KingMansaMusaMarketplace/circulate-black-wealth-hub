
import { useLoyalty } from '@/hooks/use-loyalty';

interface UseLoyaltyRewardsOptions {
  autoRefresh?: boolean;
}

export const useLoyaltyRewards = (options: UseLoyaltyRewardsOptions = {}) => {
  const { 
    totalPoints, 
    loyaltyPoints, 
    redeemReward, 
    refreshLoyaltyData 
  } = useLoyalty();
  
  return {
    totalPoints,
    loyaltyPoints,
    redeemReward,
    refreshLoyaltyData
  };
};
