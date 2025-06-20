
import { supabase } from '@/integrations/supabase/client';

type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

// Password reset request
export const requestPasswordReset = async (
  email: string,
  toast?: (props: ToastProps) => void
) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    if (error) throw error;
    
    toast?.({
      title: "Password Reset Requested",
      description: "Check your email for a link to reset your password.",
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    toast?.({
      title: "Password Reset Failed",
      description: error.message || "Failed to request password reset",
      variant: "destructive"
    });
    
    return { success: false, error };
  }
};

// Update password after reset
export const updatePassword = async (
  newPassword: string,
  toast?: (props: ToastProps) => void
) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    toast?.({
      title: "Password Updated",
      description: "Your password has been successfully updated.",
    });
    
    return { success: true, error: null };
  } catch (error: any) {
    toast?.({
      title: "Password Update Failed",
      description: error.message || "Failed to update password",
      variant: "destructive"
    });
    
    return { success: false, error };
  }
};
