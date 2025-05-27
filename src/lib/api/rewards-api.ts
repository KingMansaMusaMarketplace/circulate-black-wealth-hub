
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Reward {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  image_url?: string;
  is_global: boolean;
  business_id?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expiration_date?: string;
}

type CreateRewardData = Omit<Reward, 'id' | 'is_active' | 'created_at' | 'updated_at'>;

// Get rewards for a business
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
    console.error('Error fetching business rewards:', error.message);
    return [];
  }
};

// Create a new reward for a business
export const createBusinessReward = async (
  businessId: string,
  rewardData: CreateRewardData
): Promise<{ success: boolean; reward?: Reward; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .insert({
        ...rewardData,
        business_id: businessId,
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Reward created successfully!');
    return { success: true, reward: data };
  } catch (error: any) {
    console.error('Error creating reward:', error.message);
    toast.error('Failed to create reward: ' + error.message);
    return { success: false, error };
  }
};

// Update a reward
export const updateBusinessReward = async (
  rewardId: string,
  updates: Partial<Reward>
): Promise<{ success: boolean; reward?: Reward; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .update(updates)
      .eq('id', rewardId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Reward updated successfully!');
    return { success: true, reward: data };
  } catch (error: any) {
    console.error('Error updating reward:', error.message);
    toast.error('Failed to update reward: ' + error.message);
    return { success: false, error };
  }
};

// Delete a reward (soft delete by setting is_active to false)
export const deactivateBusinessReward = async (rewardId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('rewards')
      .update({ is_active: false })
      .eq('id', rewardId);
    
    if (error) throw error;
    
    toast.success('Reward deactivated successfully!');
    return { success: true };
  } catch (error: any) {
    console.error('Error deactivating reward:', error.message);
    toast.error('Failed to deactivate reward: ' + error.message);
    return { success: false, error };
  }
};

// Get rewards by category (useful for filtering)
export const getRewardsByCategory = async (category: string): Promise<Reward[]> => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('category', category)
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching rewards by category:', error.message);
    return [];
  }
};

// Get global rewards (available to all users)
export const getGlobalRewards = async (): Promise<Reward[]> => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_global', true)
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching global rewards:', error.message);
    return [];
  }
};
