
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { handleApiError, showUserFriendlyError, checkRateLimit, logActivity } from '@/lib/utils/error-utils';
import { validateRequiredFields, showValidationErrors } from '@/lib/utils/validation-utils';
import { errorTracker } from '@/utils/error-tracking';

export interface BusinessProfile {
  id?: string;
  owner_id: string;
  business_name: string;
  description: string;
  category: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
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
    // Check rate limit before proceeding
    const withinLimit = await checkRateLimit('fetch_business_profile', 120);
    if (!withinLimit) return null;
    
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error: any) {
    const loggedError = await handleApiError(error, 'fetchBusinessProfile', { ownerId });
    errorTracker.logError(error, {
      component: 'business-api',
      action: 'fetchBusinessProfile',
      metadata: { ownerId }
    }, 'medium');
    console.error('Error fetching business profile:', loggedError);
    return null;
  }
};

// Create or update business profile
export const saveBusinessProfile = async (profile: BusinessProfile): Promise<{ success: boolean, data?: BusinessProfile, error?: any }> => {
  try {
    // Check rate limit before proceeding
    const withinLimit = await checkRateLimit('save_business_profile', 30);
    if (!withinLimit) {
      return { success: false, error: { message: 'Rate limit exceeded' } };
    }
    
    // Validate required fields - updated to include new required fields
    const requiredFields = ['business_name', 'owner_id', 'description', 'address', 'phone', 'email'];
    const validationResult = validateRequiredFields(profile, requiredFields);
    
    if (!validationResult.isValid) {
      showValidationErrors(validationResult);
      return { success: false, error: { message: 'Validation failed', validationErrors: validationResult.errors } };
    }
    
    // Check if profile exists
    const existingProfileResult = profile.id ? 
      await supabase.from('businesses').select('id').eq('id', profile.id).maybeSingle() : 
      await supabase.from('businesses').select('id').eq('owner_id', profile.owner_id).order('created_at', { ascending: false }).limit(1);
    
    const existingProfile = { data: profile.id ? existingProfileResult.data : (existingProfileResult.data?.[0] ?? null) };
    
    let result;
    
    if (existingProfile.data) {
      // Update existing profile
      const { data, error } = await supabase
        .from('businesses')
        .update({
          ...profile,
          name: profile.business_name, // Database requires both 'name' and 'business_name'
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.data.id)
        .select();
      
      if (error) throw error;
      
      // Log activity
      await logActivity(
        'update',
        'business_profile',
        existingProfile.data.id,
        { businessName: profile.business_name }
      );
      
      result = { success: true, data: data[0] };
      toast.success('Business profile updated successfully!');
    } else {
      // Create new profile - database requires both 'name' and 'business_name' columns
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          ...profile,
          name: profile.business_name, // Database requires both 'name' and 'business_name'
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      // Log activity
      await logActivity(
        'create',
        'business_profile',
        data[0].id,
        { businessName: profile.business_name }
      );
      
      result = { success: true, data: data[0] };
      toast.success('Business profile created successfully!');
    }
    
    return result;
  } catch (error: any) {
    const loggedError = await handleApiError(error, 'saveBusinessProfile', { profileId: profile.id });
    errorTracker.logError(error, {
      component: 'business-api',
      action: 'saveBusinessProfile',
      metadata: { profileId: profile.id }
    }, 'high');
    console.error('Error saving business profile:', loggedError);
    showUserFriendlyError(loggedError, 'saving business profile');
    return { success: false, error: loggedError };
  }
};
