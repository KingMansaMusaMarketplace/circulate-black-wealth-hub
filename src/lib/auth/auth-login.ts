
import { supabase } from '@/integrations/supabase/client';

type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

// Handle user sign in
export const handleSignIn = async (
  email: string, 
  password: string,
  toast?: (props: ToastProps) => void
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
export const handleSignOut = async (
  toast?: (props: ToastProps) => void
) => {
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
