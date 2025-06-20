
import { supabase } from '@/lib/supabase';

export const handleSignUp = async (
  email: string,
  password: string,
  metadata?: any,
  showToast?: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
) => {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });

    if (error) {
      showToast?.({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      return { error };
    }

    showToast?.({
      title: 'Success',
      description: 'Account created successfully! Please check your email to verify your account.'
    });

    return { data };
  } catch (error: any) {
    showToast?.({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive'
    });
    return { error };
  }
};
