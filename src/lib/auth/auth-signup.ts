
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

    // If user signed up with a referral code, create the referral link
    if (data.user && (metadata as any)?.referral_code) {
      try {
        const referralCode = (metadata as any).referral_code;
        
        // Get the sales agent by referral code
        const { data: agentData, error: agentError } = await supabase
          .from('sales_agents')
          .select('id, user_id')
          .eq('referral_code', referralCode)
          .eq('is_active', true)
          .single();

        if (!agentError && agentData) {
          // Update the user's profile with the referred_by_agent_id
          await supabase
            .from('profiles')
            .update({ referred_by_agent_id: agentData.id })
            .eq('id', data.user.id);

          // Create the referral record
          await supabase
            .from('referrals')
            .insert({
              sales_agent_id: agentData.id,
              referred_user_id: data.user.id,
              referred_user_type: (metadata as any)?.user_type || 'customer',
              commission_status: 'pending'
            });

          console.log('Referral chain linked successfully');
        }
      } catch (referralError) {
        console.warn('Failed to link referral chain:', referralError);
        // Don't block signup if referral linking fails
      }
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

    // Send welcome email
    if (data.user) {
      try {
        const userType = (metadata as any)?.user_type || 'customer';
        const userName = (metadata as any)?.full_name || email.split('@')[0];
        
        console.log("Sending welcome email...");
        await supabase.functions.invoke('send-business-notification', {
          body: {
            type: userType === 'business' ? 'new_business' : 'new_customer',
            userId: data.user.id,
            recipientEmail: email,
            businessName: userType === 'business' ? userName : undefined,
            customerName: userType === 'customer' ? userName : undefined
          }
        });
        console.log("Welcome email sent successfully");
      } catch (emailError) {
        console.warn('Welcome email failed:', emailError);
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
