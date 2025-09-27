
import { supabase } from '@/lib/supabase';

export const handleSignUp = async (
  email: string,
  password: string,
  metadata: object = {},
  showToast: (props: { title: string; description: string; variant?: 'default' | 'destructive' }) => void
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/email-verified`
      }
    });

    if (error) {
      showToast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      return { error };
    }

    // Send custom verification email if user was created
    if (data.user && !data.user.email_confirmed_at) {
      try {
        console.log("Sending custom verification email...");
        await supabase.functions.invoke('send-verification-email', {
          body: {
            email: email,
            confirmationUrl: `${window.location.origin}/email-verified`,
            userType: (metadata as any)?.user_type || 'customer'
          },
        });
        console.log("Custom verification email sent successfully");
      } catch (emailError) {
        console.warn('Custom verification email failed, but Supabase email was sent:', emailError);
      }
    }

    showToast({
      title: 'Success',
      description: data.user?.email_confirmed_at 
        ? 'Account created successfully! You can now sign in.'
        : 'Account created successfully! Please check your email to verify your account.'
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
