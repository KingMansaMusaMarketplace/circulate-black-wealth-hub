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
    } else if (userType === 'sponsor') {
      subscriptionStatus = 'trial'; // Sponsors start with trial
    }
    
    const profileData = {
      id: userId,
      user_type: userType,
      full_name: userMetadata.fullName || userMetadata.name || '',
      email: userMetadata.email || '',
      phone: userMetadata.phone || '', // Store customer phone
      address: userMetadata.address || '', // Store customer address
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
    if (userType === 'business' && userMetadata.business_name) {
      const businessData = {
        owner_id: userId,
        business_name: userMetadata.business_name,
        description: userMetadata.business_description || '', // Store business description
        address: userMetadata.business_address || '', // Store business address
        phone: userMetadata.phone || '', // Store business phone
        email: userMetadata.email || '', // Store business email
        category: userMetadata.businessType || '',
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
    
    // If this is a sponsor user, also create sponsor record with comprehensive data
    if (userType === 'sponsor' && userMetadata.company_name) {
      const sponsorData = {
        user_id: userId,
        company_name: userMetadata.company_name,
        contact_name: userMetadata.contact_name || userMetadata.name || '',
        contact_title: userMetadata.contact_title || '',
        email: userMetadata.email || '',
        phone: userMetadata.phone || '',
        company_address: userMetadata.company_address || '',
        company_city: userMetadata.company_city || '',
        company_state: userMetadata.company_state || '',
        company_zip_code: userMetadata.company_zip_code || '',
        company_website: userMetadata.company_website || '',
        industry: userMetadata.industry || '',
        company_size: userMetadata.company_size || '',
        sponsorship_tier: userMetadata.sponsorship_tier || 'silver',
        message: userMetadata.message || '',
        subscription_status: 'trial',
        subscription_start_date: startDate,
        subscription_end_date: endDate,
        created_at: startDate,
        updated_at: startDate
      };
      
      const { error: sponsorError } = await supabase.from('sponsors').insert(sponsorData);
      
      if (sponsorError) {
        console.error('Error creating sponsor record:', sponsorError);
      }
    }
    
    console.log('User profile created successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    return { success: false, error };
  }
};
