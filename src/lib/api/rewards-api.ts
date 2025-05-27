
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Reward {
  id: string;
  business_id?: string;
  title: string;
  description?: string;
  points_cost: number;
  image_url?: string;
  is_active: boolean;
  is_global: boolean;
  created_at: string;
  updated_at: string;
}

export interface RedeemedReward {
  id: string;
  customer_id: string;
  reward_id: string;
  business_id?: string;
  points_used: number;
  redemption_date: string;
  expiration_date?: string;
  is_used: boolean;
  created_at: string;
}

export const getGlobalRewards = async (): Promise<Reward[]> => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_global', true)
      .eq('is_active', true)
      .order('points_cost', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching global rewards:', error);
    return [];
  }
};

export const getBusinessRewards = async (businessId: string): Promise<Reward[]> => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('points_cost', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching business rewards:', error);
    return [];
  }
};

export const redeemReward = async (rewardId: string, customerId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    // First get the reward details
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .single();

    if (rewardError) throw rewardError;

    // Create redemption record
    const { data, error } = await supabase
      .from('redeemed_rewards')
      .insert({
        customer_id: customerId,
        reward_id: rewardId,
        business_id: reward.business_id,
        points_used: reward.points_cost,
        is_used: false
      })
      .select()
      .single();

    if (error) throw error;

    toast.success('Reward redeemed successfully!');
    return { success: true };
  } catch (error: any) {
    console.error('Error redeeming reward:', error);
    toast.error('Failed to redeem reward: ' + error.message);
    return { success: false, error };
  }
};

export const getCustomerRedemptions = async (customerId: string): Promise<RedeemedReward[]> => {
  try {
    const { data, error } = await supabase
      .from('redeemed_rewards')
      .select('*')
      .eq('customer_id', customerId)
      .order('redemption_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching customer redemptions:', error);
    return [];
  }
};
