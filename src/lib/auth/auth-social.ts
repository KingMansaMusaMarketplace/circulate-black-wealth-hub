
import { supabase } from '@/integrations/supabase/client';
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
    // If no error or different error, proceed with the actual sign-in
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    // Let the component handle the error display since we now have a custom dialog for this
    return { data: null, error };
  }
};
