

import { supabase } from '@/lib/supabase';

// Detect if we're on a custom domain (not Lovable preview/published domains)
const isCustomDomain = () => {
  const hostname = window.location.hostname;
  return (
    !hostname.includes('lovable.app') &&
    !hostname.includes('lovableproject.com') &&
    !hostname.includes('localhost')
  );
};

// Allowed OAuth provider hostnames for redirect validation
const ALLOWED_OAUTH_HOSTS = [
  'accounts.google.com',
  'www.facebook.com',
  'github.com',
];

export const handleSocialSignIn = async (
  provider: 'google' | 'facebook' | 'github',
  showToast: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
) => {
  try {
    if (isCustomDomain()) {
      // On custom domains, bypass auth-bridge to prevent redirect loop
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        showToast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      // Validate OAuth URL before redirecting (prevent open redirect)
      if (data?.url) {
        const oauthUrl = new URL(data.url);
        if (!ALLOWED_OAUTH_HOSTS.some((host) => oauthUrl.hostname === host)) {
          throw new Error('Invalid OAuth redirect URL');
        }
        window.location.href = data.url;
      }
    } else {
      // Standard flow for Lovable domains
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        showToast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
    }
  } catch (error: any) {
    showToast({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
  }
};
