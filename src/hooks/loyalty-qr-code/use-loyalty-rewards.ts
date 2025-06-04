
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
  imageUrl?: string;
}

interface UseLoyaltyRewardsOptions {
  autoRefresh?: boolean;
  businessId?: string;
}

export const useLoyaltyRewards = (options: UseLoyaltyRewardsOptions = {}) => {
  const [loyaltyPointsData, setLoyaltyPointsData] = useState<Array<{
    businessId: string;
    businessName: string;
    points: number;
  }>>([]);
  const { user } = useAuth();
  const { 
    availableRewards,
    summary, 
    refreshData, 
    redeemReward 
  } = useLoyalty();
  
  // Format the available rewards into a more useful structure
  const formattedRewards: LoyaltyReward[] = availableRewards.map(reward => ({
    id: reward.id,
    title: reward.title,
    description: reward.description || '',
    pointsCost: reward.pointsCost,
    category: reward.category || 'General',
    businessName: reward.businessName,
    expiresAt: reward.expiresAt,
    imageUrl: reward.imageUrl
  }));

  // Update the loyaltyPoints whenever there's a change in the summary
  useEffect(() => {
    if (summary) {
      // Check if the businessesVisited data exists
      const businesses = summary.businessesVisited || 0;
      
      // Create a default array if we don't have specific business points
      const formattedPoints = [
        {
          businessId: 'all',
          businessName: 'All Businesses',
          points: summary.totalPoints || 0
        }
      ];

      setLoyaltyPointsData(formattedPoints);
    }
  }, [summary]);

  // Handle reward redemption with proper feedback
  const handleRedeemReward = async (rewardId: string, pointsCost: number) => {
    if (!user) {
      toast.error('You must be logged in to redeem rewards');
      return false;
    }
    
    try {
      await redeemReward(rewardId);
      toast.success('Reward redeemed successfully!');
      refreshData();
      return true;
    } catch (error: any) {
      console.error('Error redeeming reward:', error);
      toast.error(error.message || 'An error occurred while redeeming the reward');
      return false;
    }
  };

  return {
    totalPoints: summary?.totalPoints || 0,
    loyaltyPoints: loyaltyPointsData,
    availableRewards: formattedRewards,
    redeemReward: handleRedeemReward,
    refreshLoyaltyData: refreshData
  };
};
