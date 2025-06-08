
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface SponsorProfile {
  id?: string;
  user_id?: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  sponsorship_tier: 'silver' | 'gold' | 'platinum';
  message?: string;
  subscription_status?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  created_at?: string;
  updated_at?: string;
}

// Create sponsor profile
export const createSponsorProfile = async (profileData: SponsorProfile): Promise<{ success: boolean, data?: SponsorProfile, error?: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const sponsorData = {
      user_id: user?.id,
      company_name: profileData.company_name,
      contact_name: profileData.contact_name,
      email: profileData.email,
      phone: profileData.phone,
      sponsorship_tier: profileData.sponsorship_tier,
      message: profileData.message || '',
      subscription_status: 'pending',
      subscription_start_date: new Date().toISOString(),
      subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days trial
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('sponsors')
      .insert(sponsorData)
      .select()
      .single();

    if (error) throw error;

    toast.success('Sponsor profile created successfully!');
    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating sponsor profile:', error);
    toast.error('Failed to create sponsor profile: ' + error.message);
    return { success: false, error };
  }
};

// Fetch sponsor profile
export const fetchSponsorProfile = async (userId?: string): Promise<SponsorProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    
    if (!targetUserId) return null;

    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }

    return data as SponsorProfile;
  } catch (error: any) {
    console.error('Error fetching sponsor profile:', error);
    return null;
  }
};

// Update sponsor profile
export const updateSponsorProfile = async (profileData: SponsorProfile): Promise<{ success: boolean, data?: SponsorProfile, error?: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('sponsors')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    toast.success('Sponsor profile updated successfully!');
    return { success: true, data };
  } catch (error: any) {
    console.error('Error updating sponsor profile:', error);
    toast.error('Failed to update sponsor profile: ' + error.message);
    return { success: false, error };
  }
};
