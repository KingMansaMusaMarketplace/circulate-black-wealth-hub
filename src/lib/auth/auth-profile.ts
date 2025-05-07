
import { supabase } from '../supabase';

// Create a profile in the profiles table
export const createUserProfile = async (userId: string, userMetadata: any) => {
  try {
    const userType = userMetadata.userType || 'customer';
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    
    const profileData = {
      id: userId,
      user_type: userType,
      full_name: userMetadata.fullName || '',
      email: userMetadata.email || '',
      subscription_status: userType === 'customer' ? 'active' : 'trial',
      subscription_start_date: startDate,
      subscription_end_date: endDate,
      created_at: startDate,
      updated_at: startDate
    };
    
    const { error } = await supabase.from('profiles').insert(profileData);

    if (error) throw error;
    
    // If this is a business user, also create business record
    if (userType === 'business' && userMetadata.businessName) {
      const businessData = {
        owner_id: userId,
        business_name: userMetadata.businessName,
        category: userMetadata.businessType || '',
        address: userMetadata.businessAddress || '',
        subscription_status: 'trial',
        subscription_start_date: startDate,
        subscription_end_date: endDate,
        created_at: startDate,
        updated_at: startDate
      };
      
      const { error: businessError } = await supabase.from('businesses').insert(businessData);
      
      if (businessError) {
        console.error('Error creating business record:', businessError);
      }
    }
    
    console.log('User profile created successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    return { success: false, error };
  }
};
