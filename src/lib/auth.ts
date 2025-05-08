
import { supabase } from '@/integrations/supabase/client';
import { User, Provider } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Sign up a new user
export const handleSignUp = async (
  email: string, 
  password: string,
  metadata?: any,
  toastFn = toast
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
      toastFn({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error };
    }
    
    if (data.user) {
      toastFn({
        title: "Sign up successful",
        description: "Please check your email for verification."
      });
      return { success: true, data };
    } else {
      toastFn({
        title: "Unknown error",
        description: "Please try again later",
        variant: "destructive"
      });
      return { success: false };
    }
  } catch (error: any) {
    toastFn({
      title: "Sign up failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return { success: false, error };
  }
};

// Sign in a user
export const handleSignIn = async (
  email: string, 
  password: string,
  toastFn = toast
) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      toastFn({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error };
    }
    
    toastFn({
      title: "Login successful",
      description: `Welcome back, ${data.user?.email}!`
    });
    return { success: true, data };
  } catch (error: any) {
    toastFn({
      title: "Login failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return { success: false, error };
  }
};

// Sign out the current user
export const handleSignOut = async (toastFn = toast) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toastFn({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error };
    }
    
    toastFn({
      title: "Signed out",
      description: "You have been successfully signed out."
    });
    return { success: true };
  } catch (error: any) {
    toastFn({
      title: "Sign out failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return { success: false, error };
  }
};

// Handle social sign-in
export const handleSocialSignIn = async (provider: Provider, toastFn = toast) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider
    });
    
    if (error) {
      toastFn({
        title: "Social login failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error: any) {
    toastFn({
      title: "Social login failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return { success: false, error };
  }
};

// Request password reset
export const requestPasswordReset = async (email: string, toastFn = toast) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/new-password`,
    });
    
    if (error) {
      toastFn({
        title: "Password reset request failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error };
    }
    
    toastFn({
      title: "Password reset email sent",
      description: "Check your email for the reset link."
    });
    return { success: true };
  } catch (error: any) {
    toastFn({
      title: "Password reset request failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return { success: false, error };
  }
};

// Update password
export const updatePassword = async (newPassword: string, toastFn = toast) => {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      toastFn({
        title: "Password update failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error };
    }
    
    toastFn({
      title: "Password updated",
      description: "Your password has been updated successfully."
    });
    return { success: true };
  } catch (error: any) {
    toastFn({
      title: "Password update failed",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return { success: false, error };
  }
};
