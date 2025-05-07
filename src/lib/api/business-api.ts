
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface BusinessProfile {
  id?: string;
  owner_id: string;
  business_name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website?: string;
  logo_url?: string;
  banner_url?: string;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  qr_code_id?: string;
  qr_code_url?: string;
}

// Fetch business profile for a specific owner
export const fetchBusinessProfile = async (ownerId: string): Promise<BusinessProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', ownerId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching business profile:', error.message);
    return null;
  }
};

// Create or update business profile
export const saveBusinessProfile = async (profile: BusinessProfile): Promise<{ success: boolean, data?: BusinessProfile, error?: any }> => {
  try {
    // Check if profile exists
    const existingProfile = profile.id ? 
      await supabase.from('businesses').select('id').eq('id', profile.id).single() : 
      await supabase.from('businesses').select('id').eq('owner_id', profile.owner_id).single();
    
    let result;
    
    if (existingProfile.data) {
      // Update existing profile
      const { data, error } = await supabase
        .from('businesses')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.data.id)
        .select();
      
      if (error) throw error;
      result = { success: true, data: data[0] };
      toast.success('Business profile updated successfully!');
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          ...profile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      result = { success: true, data: data[0] };
      toast.success('Business profile created successfully!');
    }
    
    return result;
  } catch (error: any) {
    console.error('Error saving business profile:', error.message);
    toast.error('Failed to save business profile: ' + error.message);
    return { success: false, error };
  }
};
