
import { supabase } from '../supabase';
import { createUserProfile } from './auth-profile';

type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

// Handle user sign up
export const handleSignUp = async (
  email: string, 
  password: string, 
  metadata?: any,
  toast?: (props: ToastProps) => void
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
