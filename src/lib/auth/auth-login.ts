
import { supabase } from '@/lib/supabase';

export const handleSignIn = async (
  email: string,
  password: string,
  showToast: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showToast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      return { error };
    }

    showToast({
      title: 'Success',
      description: 'Successfully signed in'
    });

    return { data };
  } catch (error: any) {
    showToast({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive'
    });
    return { error };
  }
};

export const handleSignOut = async (
  showToast: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showToast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }

    showToast({
      title: 'Success',
      description: 'Successfully signed out'
    });
  } catch (error: any) {
    showToast({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive'
    });
  }
};
