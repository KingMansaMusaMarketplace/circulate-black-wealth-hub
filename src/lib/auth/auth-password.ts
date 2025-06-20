
import { supabase } from '@/lib/supabase';

export const requestPasswordReset = async (
  email: string,
  showToast?: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      showToast?.({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      return { success: false, error };
    }

    showToast?.({
      title: 'Success',
      description: 'Password reset email sent'
    });

    return { success: true };
  } catch (error: any) {
    showToast?.({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive'
    });
    return { success: false, error };
  }
};

export const updatePassword = async (
  newPassword: string,
  showToast?: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      showToast?.({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      return { success: false, error };
    }

    showToast?.({
      title: 'Success',
      description: 'Password updated successfully'
    });

    return { success: true };
  } catch (error: any) {
    showToast?.({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive'
    });
    return { success: false, error };
  }
};
