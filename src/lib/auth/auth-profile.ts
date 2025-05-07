
import { supabase } from '../supabase';

// Create a profile in the profiles table
export const createUserProfile = async (userId: string, userMetadata: any) => {
  try {
    const { error } = await supabase.from('profiles').insert({
      id: userId,
      user_type: userMetadata.userType || 'customer',
      full_name: userMetadata.fullName || '',
      email: userMetadata.email || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    
    console.log('User profile created successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    return { success: false, error };
  }
};
