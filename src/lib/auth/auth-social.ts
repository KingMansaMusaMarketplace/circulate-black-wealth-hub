
import { supabase } from '@/integrations/supabase/client';
import { ToastProps } from '@/contexts/auth/types';
import { Provider } from '@supabase/supabase-js';

export const handleSocialSignIn = async (
  provider: 'google' | 'facebook' | 'github', 
  toastFn?: (props: ToastProps) => any
) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Social login error:', error);
      if (toastFn) {
        toastFn({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
      }
      return { error };
    }

    console.log('Social login initiated:', data);
    return { data };
  } catch (error: any) {
    console.error('Unexpected error during social login:', error);
    if (toastFn) {
      toastFn({
        title: 'Login Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
    return { error };
  }
};
