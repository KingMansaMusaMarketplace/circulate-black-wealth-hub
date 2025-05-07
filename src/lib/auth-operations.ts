
import { supabase } from './supabase';
import { UseToastReturn } from '@/hooks/use-toast';

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

// Handle user sign up
export const handleSignUp = async (
  email: string, 
  password: string, 
  metadata?: any,
  toast?: UseToastReturn['toast']
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    
    // Create user profile in the database
    if (data.user) {
      await createUserProfile(data.user.id, { ...metadata, email });
    }
    
    toast?.({
      title: "Sign Up Successful!",
      description: "You're now registered with Mansa Musa Marketplace.",
    });
    
    return { data, error: null };
  } catch (error: any) {
    toast?.({
      title: "Sign Up Failed",
      description: error.message || "An error occurred during sign up",
      variant: "destructive"
    });
    
    return { data: null, error };
  }
};

// Handle user sign in
export const handleSignIn = async (
  email: string, 
  password: string,
  toast?: UseToastReturn['toast']
) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    toast?.({
      title: "Login Successful",
      description: "Welcome back to Mansa Musa Marketplace!",
    });
    
    return { data, error: null };
  } catch (error: any) {
    toast?.({
      title: "Login Failed",
      description: error.message || "Invalid email or password",
      variant: "destructive"
    });
    
    return { data: null, error };
  }
};

// Handle user sign out
export const handleSignOut = async (toast?: UseToastReturn['toast']) => {
  try {
    await supabase.auth.signOut();
    
    toast?.({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });

    return { success: true };
  } catch (error: any) {
    toast?.({
      title: "Sign Out Failed",
      description: error.message || "An error occurred during sign out",
      variant: "destructive"
    });
    
    return { success: false, error };
  }
};
