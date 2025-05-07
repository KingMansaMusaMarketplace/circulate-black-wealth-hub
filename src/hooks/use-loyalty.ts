
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getCustomerLoyaltyPoints,
  getCustomerTotalLoyaltyPoints,
  getAvailableRewards,
  redeemReward,
  getCustomerRedeemedRewards,
  LoyaltyPoints,
  Reward,
  RedeemedReward
} from '@/lib/api/loyalty-api';
import { getCustomerTransactions, Transaction } from '@/lib/api/transaction-api';

export const useLoyalty = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load all loyalty data
  const loadLoyaltyData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [points, total, rewards, redeemed, history] = await Promise.all([
        getCustomerLoyaltyPoints(user.id),
        getCustomerTotalLoyaltyPoints(user.id),
        getAvailableRewards(),
        getCustomerRedeemedRewards(user.id),
        getCustomerTransactions(user.id)
      ]);
      
      setLoyaltyPoints(points);
      setTotalPoints(total);
      setAvailableRewards(rewards);
      setRedeemedRewards(redeemed);
      setTransactions(history);
    } catch (error) {
      console.error('Error loading loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadLoyaltyData();
  }, [user?.id]);

  // Function to redeem a reward
  const handleRedeemReward = async (rewardId: string) => {
    if (!user?.id) return false;
    
    try {
      const result = await redeemReward(rewardId, user.id);
      if (result.success) {
        // Refresh loyalty data
        await loadLoyaltyData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      return false;
    }
  };

  return {
    loading,
    loyaltyPoints,
    totalPoints,
    availableRewards,
    redeemedRewards,
    transactions,
    redeemReward: handleRedeemReward,
    refreshLoyaltyData: loadLoyaltyData
  };
};
