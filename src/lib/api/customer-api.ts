
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface CustomerProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  avatar_url?: string;
  date_of_birth?: string;
  loyalty_points: number;
  total_scans: number;
  total_purchases: number;
  created_at: string;
  updated_at: string;
  user_type: string;
  is_hbcu_member: boolean;
  hbcu_verification_status: 'pending' | 'approved' | 'rejected';
  hbcu_institution?: string;
  graduation_year?: number;
}

// Get customer profile by user ID
export const getCustomerProfile = async (userId: string): Promise<CustomerProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('user_type', 'customer')
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      user_id: data.id
    } as CustomerProfile;
  } catch (error: any) {
    console.error('Error fetching customer profile:', error.message);
    return null;
  }
};

// Update customer profile
export const updateCustomerProfile = async (
  userId: string, 
  updates: Partial<CustomerProfile>
): Promise<{ success: boolean; profile?: CustomerProfile; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Profile updated successfully!');
    return { 
      success: true, 
      profile: {
        ...data,
        user_id: data.id
      } as CustomerProfile 
    };
  } catch (error: any) {
    console.error('Error updating customer profile:', error.message);
    toast.error('Failed to update profile: ' + error.message);
    return { success: false, error };
  }
};

// Get customer loyalty stats
export const getCustomerLoyaltyStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('qr_scans')
      .select('points_awarded, scanned_at')
      .eq('customer_id', userId)
      .order('scanned_at', { ascending: false });
    
    if (error) throw error;
    
    const totalPoints = data?.reduce((sum, scan) => sum + (scan.points_awarded || 0), 0) || 0;
    const totalScans = data?.length || 0;
    
    return {
      totalPoints,
      totalScans,
      recentScans: data?.slice(0, 10) || []
    };
  } catch (error: any) {
    console.error('Error fetching loyalty stats:', error.message);
    return {
      totalPoints: 0,
      totalScans: 0,
      recentScans: []
    };
  }
};

// Get customer's favorite businesses
export const getCustomerFavoriteBusinesses = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('qr_scans')
      .select(`
        business_id,
        businesses!inner(
          id,
          business_name,
          logo_url,
          category
        )
      `)
      .eq('customer_id', userId);
    
    if (error) throw error;
    
    // Group by business and count visits
    const businessCounts = data?.reduce((acc: any, scan: any) => {
      const businessId = scan.business_id;
      if (!acc[businessId]) {
        acc[businessId] = {
          business: scan.businesses,
          visitCount: 0
        };
      }
      acc[businessId].visitCount++;
      return acc;
    }, {});
    
    // Convert to array and sort by visit count
    const favorites = Object.values(businessCounts || {})
      .sort((a: any, b: any) => b.visitCount - a.visitCount)
      .slice(0, 5);
    
    return favorites;
  } catch (error: any) {
    console.error('Error fetching favorite businesses:', error.message);
    return [];
  }
};
