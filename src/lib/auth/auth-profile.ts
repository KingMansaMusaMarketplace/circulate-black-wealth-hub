
import { supabase } from '@/integrations/supabase/client';

// Create a profile in the profiles table
export const createUserProfile = async (userId: string, userMetadata: any) => {
  try {
    const userType = userMetadata.userType || userMetadata.user_type || 'customer';
    const subscriptionTier = userMetadata.subscription_tier || 'free';
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    
    // Determine subscription status based on tier and user type
    let subscriptionStatus = 'active';
    if (userType === 'business') {
      subscriptionStatus = 'trial';
    } else if (userType === 'customer' && subscriptionTier === 'free') {
      subscriptionStatus = 'active'; // Free customers are always active
    } else if (userType === 'customer' && subscriptionTier === 'paid') {
      subscriptionStatus = 'trial'; // Will be updated to active after payment
    }
    
    const profileData = {
      id: userId,
      user_type: userType,
      full_name: userMetadata.fullName || userMetadata.name || '',
      email: userMetadata.email || '',
      subscription_status: subscriptionStatus,
      subscription_tier: subscriptionTier,
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
