
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  category: string;
  businessName?: string;
  expiresAt?: string;
  image_url?: string;
}

export interface LoyaltySummary {
  totalPoints: number;
  businessesVisited: number;
  totalScans: number;
  monthlyEarnings: number;
}

export interface PointsHistoryEntry {
  date: string;
  points: number;
  type: 'earned' | 'redeemed';
  businessName?: string;
  description?: string;
}

export const useLoyalty = () => {
  const { user } = useAuth();
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryEntry[]>([]);
  const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([]);
  const [summary, setSummary] = useState<LoyaltySummary | null>(null);
  const [redeemedRewards, setRedeemedRewards] = useState<LoyaltyReward[]>([]);

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Mock data for now - replace with actual API calls
        setLoyaltyPoints(1250);
        
        // Mock points history
        setPointsHistory([
          {
            date: new Date().toISOString(),
            points: 25,
            type: 'earned',
            businessName: 'Test Business',
            description: 'Purchase reward'
          }
        ]);

        // Mock available rewards
        setAvailableRewards([
          {
            id: '1',
            title: 'Free Coffee',
            description: 'Get a free coffee at participating locations',
            points_cost: 100,
            category: 'Food & Beverage'
          }
        ]);

        // Mock summary
        setSummary({
          totalPoints: 1250,
          businessesVisited: 5,
          totalScans: 15,
          monthlyEarnings: 250
        });

        setRedeemedRewards([]);
      } catch (error) {
        console.error('Error fetching loyalty data:', error);
        setLoyaltyPoints(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoyaltyData();
  }, [user]);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const redeemReward = async (rewardId: string, pointsCost: number) => {
    try {
      // Mock redemption logic
      if (loyaltyPoints >= pointsCost) {
        setLoyaltyPoints(prev => prev - pointsCost);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      return false;
    }
  };

  // Calculate next reward threshold and current tier
  const nextRewardThreshold = 1500; // Mock value
  const currentTier = loyaltyPoints >= 1000 ? 'Gold' : loyaltyPoints >= 500 ? 'Silver' : 'Bronze';

  return {
    loyaltyPoints,
    isLoading,
    pointsHistory,
    availableRewards,
    summary,
    redeemedRewards,
    nextRewardThreshold,
    currentTier,
    refreshData,
    redeemReward
  };
};
