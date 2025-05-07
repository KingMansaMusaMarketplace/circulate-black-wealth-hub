
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface CustomerProfile {
  id?: string;
  user_id: string;
  full_name: string;
  phone?: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch customer profile
export const fetchCustomerProfile = async (userId: string): Promise<CustomerProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('user_type', 'customer')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching customer profile:', error.message);
    return null;
  }
};

// Create or update customer profile
export const saveCustomerProfile = async (profile: CustomerProfile): Promise<{ success: boolean, data?: CustomerProfile, error?: any }> => {
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profile.user_id)
      .single();
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.user_id)
        .select();
      
      if (error) throw error;
      result = { success: true, data: data[0] };
      toast.success('Customer profile updated successfully!');
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          ...profile,
          id: profile.user_id,
          user_type: 'customer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      result = { success: true, data: data[0] };
      toast.success('Customer profile created successfully!');
    }
    
    return result;
  } catch (error: any) {
    console.error('Error saving customer profile:', error.message);
    toast.error('Failed to save customer profile: ' + error.message);
    return { success: false, error };
  }
};
