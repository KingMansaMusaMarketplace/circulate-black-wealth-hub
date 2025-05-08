
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface LoyaltySummary {
  totalPoints: number;
  pointsEarned: number;
  pointsRedeemed: number;
  businessesVisited: number;
  visitsThisMonth: number;
}

export interface LoyaltyTransaction {
  id: string;
  businessName: string;
  businessLogo?: string;
  action: 'scan' | 'redeem' | 'referral' | 'review';
  points: number;
  date: string;
  time: string;
  description?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  businessId?: string;
  businessName?: string;
  category: string;
  expiresAt?: string;
  imageUrl?: string;
}

export const useLoyalty = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<LoyaltySummary>({
    totalPoints: 0,
    pointsEarned: 0,
    pointsRedeemed: 0,
    businessesVisited: 0,
    visitsThisMonth: 0
  });
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<any[]>([]);

  // Load loyalty summary data
  const loadLoyaltySummary = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get total current points
      const { data: pointsData, error: pointsError } = await supabase
        .from('loyalty_points')
        .select('points, businesses(business_name, logo_url)')
        .eq('customer_id', user.id);
        
      if (pointsError) throw pointsError;
      
      // Calculate total points and businesses visited
      const totalPoints = pointsData?.reduce((sum, item) => sum + item.points, 0) || 0;
      const businessesVisited = pointsData?.length || 0;
      
      // Get transaction history for points earned and redeemed
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('points_earned, points_redeemed, transaction_date')
        .eq('customer_id', user.id);
        
      if (transactionsError) throw transactionsError;
      
      // Calculate points earned and redeemed
      const pointsEarned = transactionsData?.reduce((sum, item) => sum + item.points_earned, 0) || 0;
      const pointsRedeemed = transactionsData?.reduce((sum, item) => sum + item.points_redeemed, 0) || 0;
      
      // Calculate visits this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      const { count: visitsThisMonth, error: visitsError } = await supabase
        .from('qr_scans')
        .select('*', { count: 'exact' })
        .eq('customer_id', user.id)
        .gte('scan_date', firstDayOfMonth);
        
      if (visitsError) throw visitsError;
      
      // Update summary state
      setSummary({
        totalPoints,
        pointsEarned,
        pointsRedeemed,
        businessesVisited,
        visitsThisMonth: visitsThisMonth || 0
      });
    } catch (error) {
      console.error('Error loading loyalty summary:', error);
      toast.error('Failed to load loyalty summary');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load transactions
  const loadTransactions = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get transactions with business names
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id, 
          transaction_type, 
          points_earned, 
          points_redeemed, 
          description, 
          transaction_date,
          businesses(business_name, logo_url)
        `)
        .eq('customer_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      
      // Format transactions for display
      const formattedTransactions: LoyaltyTransaction[] = data.map(item => {
        const date = new Date(item.transaction_date);
        
        // Map transaction type to action
        let action: 'scan' | 'redeem' | 'referral' | 'review' = 'scan';
        if (item.transaction_type === 'redemption') action = 'redeem';
        else if (item.transaction_type === 'referral') action = 'referral';
        else if (item.transaction_type === 'review') action = 'review';
        
        return {
          id: item.id,
          businessName: item.businesses?.business_name || 'Business',
          businessLogo: item.businesses?.logo_url,
          action,
          points: item.points_earned > 0 ? item.points_earned : -item.points_redeemed,
          date: date.toLocaleDateString(),
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: item.description
        };
      });
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load available rewards
  const loadAvailableRewards = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select(`
          id,
          title,
          description,
          points_cost,
          image_url,
          is_global,
          is_active,
          business_id,
          businesses(business_name)
        `)
        .eq('is_active', true);
        
      if (error) throw error;
      
      // Format rewards for display
      const formattedRewards: Reward[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        pointsCost: item.points_cost,
        businessId: item.business_id,
        businessName: item.businesses?.business_name,
        category: item.is_global ? 'Global Rewards' : 'Business Rewards',
        imageUrl: item.image_url,
      }));
      
      setAvailableRewards(formattedRewards);
    } catch (error) {
      console.error('Error loading rewards:', error);
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load redeemed rewards
  const loadRedeemedRewards = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('redeemed_rewards')
        .select(`
          id,
          redemption_date,
          expiration_date,
          points_used,
          is_used,
          rewards(title, description, image_url),
          businesses(business_name)
        `)
        .eq('customer_id', user.id)
        .order('redemption_date', { ascending: false });
        
      if (error) throw error;
      
      setRedeemedRewards(data);
    } catch (error) {
      console.error('Error loading redeemed rewards:', error);
      toast.error('Failed to load redeemed rewards');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Redeem a reward
  const redeemReward = async (rewardId: string, pointsCost: number): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to redeem rewards');
      return false;
    }
    
    if (summary.totalPoints < pointsCost) {
      toast.error('Not enough points to redeem this reward');
      return false;
    }
    
    setLoading(true);
    try {
      // Get the reward details
      const { data: reward, error: rewardError } = await supabase
        .from('rewards')
        .select('*, businesses(business_name)')
        .eq('id', rewardId)
        .single();
        
      if (rewardError) throw rewardError;
      
      // Create a redemption record
      const { data: redemption, error: redemptionError } = await supabase
        .from('redeemed_rewards')
        .insert({
          reward_id: rewardId,
          customer_id: user.id,
          business_id: reward.business_id,
          points_used: pointsCost,
          redemption_date: new Date().toISOString(),
          expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days expiry
        });
        
      if (redemptionError) throw redemptionError;
      
      // Record the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          customer_id: user.id,
          business_id: reward.business_id,
          points_redeemed: pointsCost,
          points_earned: 0,
          description: `Redeemed: ${reward.title}`,
          transaction_type: 'redemption',
          transaction_date: new Date().toISOString()
        });
        
      if (transactionError) throw transactionError;
      
      toast.success(`${reward.title} redeemed successfully!`);
      
      // Refresh data
      await loadLoyaltySummary();
      await loadTransactions();
      await loadRedeemedRewards();
      
      return true;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to redeem reward');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load all data on component mount or when user changes
  useEffect(() => {
    if (user) {
      loadLoyaltySummary();
      loadTransactions();
      loadAvailableRewards();
      loadRedeemedRewards();
    }
  }, [user, loadLoyaltySummary, loadTransactions, loadAvailableRewards, loadRedeemedRewards]);

  return {
    loading,
    summary,
    transactions,
    availableRewards,
    redeemedRewards,
    redeemReward,
    refreshData: useCallback(() => {
      loadLoyaltySummary();
      loadTransactions();
      loadAvailableRewards();
      loadRedeemedRewards();
    }, [loadLoyaltySummary, loadTransactions, loadAvailableRewards, loadRedeemedRewards])
  };
};
