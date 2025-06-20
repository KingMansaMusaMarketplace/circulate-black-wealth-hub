
import { supabase } from '@/lib/supabase';

export const handleSocialSignIn = async (
  provider: 'google' | 'facebook' | 'github',
  showToast?: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`
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
