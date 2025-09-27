
import { supabase } from '@/lib/supabase';
import { logFailedAuthAttempt } from '@/lib/security/audit-logger';

export const handleSignIn = async (
  email: string,
  password: string,
  showToast: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
) => {
  try {
    // Check server-side rate limiting before attempting authentication
    const { data: rateLimitCheck } = await supabase.rpc('check_auth_rate_limit_secure', {
      p_email: email,
      p_ip: null // IP will be handled server-side
    });

    if (rateLimitCheck && !rateLimitCheck.allowed) {
      const blockMessage = rateLimitCheck.blocked_until 
        ? `Too many failed attempts. Try again after ${new Date(rateLimitCheck.blocked_until).toLocaleTimeString()}`
        : 'Rate limit exceeded. Please try again later.';
      
      showToast({
        title: 'Authentication Blocked',
        description: blockMessage,
        variant: 'destructive'
      });
      return { error: new Error('Rate limited') };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Log failed authentication attempt for security monitoring
      await logFailedAuthAttempt(email, error.message);
      
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
    // Log any unexpected errors
    await logFailedAuthAttempt(email, error.message || 'Unexpected error');
    
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
