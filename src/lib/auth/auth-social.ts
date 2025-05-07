
import { supabase } from '../supabase';
import { Provider } from '@supabase/supabase-js';

type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

// Handle social sign in
export const handleSocialSignIn = async (
  provider: Provider,
  toast?: (props: ToastProps) => void
) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    toast?.({
      title: "Social Login Failed",
      description: error.message || `Failed to sign in with ${provider}`,
      variant: "destructive"
    });
    
    return { data: null, error };
  }
};
