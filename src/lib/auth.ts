
import { supabase } from '@/integrations/supabase/client';
import { User, Provider } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Sign up a new user
export const handleSignUp = async (
  email: string, 
  password: string,
  metadata?: any
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) {
      toast.error("Sign up failed", {
        description: error.message
      });
      return { success: false, error };
    }
    
    if (data.user) {
      toast.success("Sign up successful", {
        description: "Please check your email for verification."
      });
      return { success: true, data };
    } else {
      toast.error("Unknown error", {
        description: "Please try again later"
      });
      return { success: false };
    }
  } catch (error: any) {
    toast.error("Sign up failed", {
      description: error.message || "An unexpected error occurred"
    });
    return { success: false, error };
  }
};

// Sign in a user
export const handleSignIn = async (
  email: string, 
  password: string
) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      toast.error("Login failed", {
        description: error.message
      });
      return { success: false, error };
    }
    
    toast.success("Login successful", {
      description: `Welcome back, ${data.user?.email}!`
    });
    return { success: true, data };
  } catch (error: any) {
    toast.error("Login failed", {
      description: error.message || "An unexpected error occurred"
    });
    return { success: false, error };
  }
};

// Sign out the current user
export const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error("Sign out failed", {
        description: error.message
      });
      return { success: false, error };
    }
    
    toast.success("Signed out", {
      description: "You have been successfully signed out."
    });
    return { success: true };
  } catch (error: any) {
    toast.error("Sign out failed", {
      description: error.message || "An unexpected error occurred"
    });
    return { success: false, error };
  }
};

// Handle social sign-in
export const handleSocialSignIn = async (provider: Provider) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider
    });
    
    if (error) {
      toast.error("Social login failed", {
        description: error.message
      });
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error: any) {
    toast.error("Social login failed", {
      description: error.message || "An unexpected error occurred"
    });
    return { success: false, error };
  }
};

// Request password reset
export const requestPasswordReset = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/new-password`,
    });
    
    if (error) {
      toast.error("Password reset request failed", {
        description: error.message
      });
      return { success: false, error };
    }
    
    toast.success("Password reset email sent", {
      description: "Check your email for the reset link."
    });
    return { success: true };
  } catch (error: any) {
    toast.error("Password reset request failed", {
      description: error.message || "An unexpected error occurred"
    });
    return { success: false, error };
  }
};

// Update password
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      toast.error("Password update failed", {
        description: error.message
      });
      return { success: false, error };
    }
    
    toast.success("Password updated", {
      description: "Your password has been updated successfully."
    });
    return { success: true };
  } catch (error: any) {
    toast.error("Password update failed", {
      description: error.message || "An unexpected error occurred"
    });
    return { success: false, error };
  }
};
