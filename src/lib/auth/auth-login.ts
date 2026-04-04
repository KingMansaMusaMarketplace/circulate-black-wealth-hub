
import { supabase } from '@/lib/supabase';
import { logFailedAuthAttempt } from '@/lib/security/audit-logger';
import { checkAuthRateLimit, resetAuthRateLimit } from '@/lib/security/auth-rate-guard';

export const handleSignIn = async (
  email: string,
  password: string,
  showToast: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
) => {
  try {
    // Check server-side rate limiting via edge function (brute-force protection)
    const rateLimitCheck = await checkAuthRateLimit(email, 'login');

    if (!rateLimitCheck.allowed) {
      const retryMinutes = Math.ceil(rateLimitCheck.retry_after_seconds / 60);
      showToast({
        title: 'Too Many Attempts',
        description: `Account temporarily locked. Try again in ${retryMinutes} minute${retryMinutes !== 1 ? 's' : ''}.`,
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
