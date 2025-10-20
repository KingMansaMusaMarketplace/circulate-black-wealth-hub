import { supabase } from '@/integrations/supabase/client';
import { 
  safeValidateProfileCreation, 
  safeValidateBusinessCreation, 
  safeValidateSponsorCreation 
} from '@/lib/validation/profile-validation';
import { sanitizeTextInput } from '@/lib/validation/business-validation';

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
      full_name: sanitizeTextInput(userMetadata.fullName || userMetadata.name || ''),
      email: sanitizeTextInput(userMetadata.email || ''),
      phone: sanitizeTextInput(userMetadata.phone || ''),
      address: sanitizeTextInput(userMetadata.address || ''),
      subscription_status: subscriptionStatus,
      subscription_tier: subscriptionTier,
      subscription_start_date: startDate,
      subscription_end_date: endDate,
      created_at: startDate,
      updated_at: startDate
    };
    
    // Validate profile data before inserting
    const profileValidation = safeValidateProfileCreation(profileData);
    if (!profileValidation.success) {
      throw new Error(`Profile validation failed: ${profileValidation.error.message}`);
    }
    
    const { error } = await supabase.from('profiles').insert(profileValidation.data);

    if (error) throw error;
    
    // If this is a business user, also create business record
    if (userType === 'business' && userMetadata.business_name) {
      const businessData = {
        owner_id: userId,
        business_name: sanitizeTextInput(userMetadata.business_name),
        name: sanitizeTextInput(userMetadata.business_name),
        description: sanitizeTextInput(userMetadata.business_description || ''),
        address: sanitizeTextInput(userMetadata.business_address || ''),
        phone: sanitizeTextInput(userMetadata.phone || ''),
        email: sanitizeTextInput(userMetadata.email || ''),
        category: sanitizeTextInput(userMetadata.businessType || ''),
        subscription_status: 'trial',
        subscription_start_date: startDate,
        subscription_end_date: endDate,
        created_at: startDate,
        updated_at: startDate
      };
      
      // Validate business data before inserting
      const businessValidation = safeValidateBusinessCreation(businessData);
      if (!businessValidation.success) {
        console.error('Business validation failed:', businessValidation.error);
        throw new Error(`Business validation failed: ${businessValidation.error.message}`);
      }
      
      const { error: businessError } = await supabase.from('businesses').insert(businessValidation.data);
      
      if (businessError) {
        console.error('Error creating business record:', businessError);
      }
      
      // Create private contact info entry
      if (businessValidation.data.phone || businessValidation.data.email) {
        const { data: createdBusiness } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', userId)
          .single();
          
        if (createdBusiness) {
          await supabase.from('businesses_private').insert({
            business_id: createdBusiness.id,
            phone: businessValidation.data.phone,
            email: businessValidation.data.email
          });
        }
      }
    }
    
    // If this is a sponsor user, also create sponsor record with comprehensive data
    if (userType === 'sponsor' && userMetadata.company_name) {
      const sponsorData = {
        user_id: userId,
        company_name: sanitizeTextInput(userMetadata.company_name),
        contact_name: sanitizeTextInput(userMetadata.contact_name || userMetadata.name || ''),
        contact_title: sanitizeTextInput(userMetadata.contact_title || ''),
        email: sanitizeTextInput(userMetadata.email || ''),
        phone: sanitizeTextInput(userMetadata.phone || ''),
        company_address: sanitizeTextInput(userMetadata.company_address || ''),
        company_city: sanitizeTextInput(userMetadata.company_city || ''),
        company_state: sanitizeTextInput(userMetadata.company_state || ''),
        company_zip_code: sanitizeTextInput(userMetadata.company_zip_code || ''),
        company_website: sanitizeTextInput(userMetadata.company_website || ''),
        industry: sanitizeTextInput(userMetadata.industry || ''),
        company_size: sanitizeTextInput(userMetadata.company_size || ''),
        sponsorship_tier: sanitizeTextInput(userMetadata.sponsorship_tier || 'silver'),
        message: sanitizeTextInput(userMetadata.message || ''),
        subscription_status: 'trial',
        subscription_start_date: startDate,
        subscription_end_date: endDate,
        created_at: startDate,
        updated_at: startDate
      };
      
      // Validate sponsor data before inserting
      const sponsorValidation = safeValidateSponsorCreation(sponsorData);
      if (!sponsorValidation.success) {
        console.error('Sponsor validation failed:', sponsorValidation.error);
        throw new Error(`Sponsor validation failed: ${sponsorValidation.error.message}`);
      }
      
      const { error: sponsorError } = await supabase.from('sponsors').insert(sponsorValidation.data);
      
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
