
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
    // Check if the provider is enabled in Supabase
    const { error: providerError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/dashboard',
        skipBrowserRedirect: true // Don't redirect yet, just check if provider is enabled
      }
    });
    
    // If there's an error about provider not being enabled
    if (providerError && providerError.message.includes('provider is not enabled')) {
      toast?.({
        title: "Provider Not Enabled",
        description: `The ${provider} login provider is not enabled in your Supabase project. Please enable it in the Supabase Dashboard.`,
        variant: "destructive"
      });
      return { data: null, error: providerError };
    }
    
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
    toast?.({
      title: "Social Login Failed",
      description: error.message || `Failed to sign in with ${provider}`,
      variant: "destructive"
    });
    
    return { data: null, error };
  }
};
