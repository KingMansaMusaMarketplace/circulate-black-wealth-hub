
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface LoyaltyPoints {
  id: string;
  customer_id: string;
  business_id: string;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  image_url?: string;
  is_global: boolean;
  business_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RedeemedReward {
  id: string;
  reward_id: string;
  customer_id: string;
  business_id?: string;
  points_used: number;
  redemption_date: string;
  expiration_date?: string;
  is_used: boolean;
  created_at: string;
}

// Get loyalty points for a customer
export const getCustomerLoyaltyPoints = async (customerId: string): Promise<LoyaltyPoints[]> => {
  try {
    const { data, error } = await supabase
      .from('loyalty_points')
      .select('*, businesses(business_name, logo_url)')
      .eq('customer_id', customerId);
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching loyalty points:', error.message);
    return [];
  }
};

// Get total loyalty points for a customer
export const getCustomerTotalLoyaltyPoints = async (customerId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('loyalty_points')
      .select('points')
      .eq('customer_id', customerId);
    
    if (error) throw error;
    
    // Sum all points
    const totalPoints = (data || []).reduce((sum, item) => sum + item.points, 0);
    return totalPoints;
  } catch (error: any) {
    console.error('Error fetching total loyalty points:', error.message);
    return 0;
  }
};

// Get available rewards
export const getAvailableRewards = async (): Promise<Reward[]> => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*, businesses(business_name)')
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching available rewards:', error.message);
    return [];
  }
};

// Redeem a reward
export const redeemReward = async (
  rewardId: string,
  customerId: string
): Promise<{ success: boolean; redeemedReward?: RedeemedReward; error?: any }> => {
  try {
    // Get the reward details
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .single();
    
    if (rewardError) throw rewardError;
    if (!reward) throw new Error('Reward not found');
    
    // Get customer's total points
    const totalPoints = await getCustomerTotalLoyaltyPoints(customerId);
    
    // Check if customer has enough points
    if (totalPoints < reward.points_cost) {
      toast.error('Not enough points to redeem this reward');
      return { success: false, error: 'Insufficient points' };
    }
    
    // Create redemption record
    const { data: redemption, error: redemptionError } = await supabase
      .from('redeemed_rewards')
      .insert({
        reward_id: rewardId,
        customer_id: customerId,
        business_id: reward.business_id,
        points_used: reward.points_cost,
        expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days expiry
      })
      .select()
      .single();
    
    if (redemptionError) throw redemptionError;
    
    // Create transaction record
    await supabase
      .from('transactions')
      .insert({
        customer_id: customerId,
        business_id: reward.business_id,
        points_redeemed: reward.points_cost,
        description: `Redeemed: ${reward.title}`,
        transaction_type: 'redemption',
      });
    
    toast.success('Reward redeemed successfully!');
    return { success: true, redeemedReward: redemption };
  } catch (error: any) {
    console.error('Error redeeming reward:', error.message);
    toast.error('Failed to redeem reward: ' + error.message);
    return { success: false, error };
  }
};

// Get redeemed rewards for a customer
export const getCustomerRedeemedRewards = async (customerId: string): Promise<RedeemedReward[]> => {
  try {
    const { data, error } = await supabase
      .from('redeemed_rewards')
      .select('*, rewards(title, description, image_url), businesses(business_name)')
      .eq('customer_id', customerId)
      .order('redemption_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching redeemed rewards:', error.message);
    return [];
  }
};
