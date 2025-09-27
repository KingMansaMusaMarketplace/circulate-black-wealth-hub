import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EmailVerificationBanner: React.FC = () => {
  const { user } = useAuth();
  const [resending, setResending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Don't show if user is verified or banner is dismissed
  if (!user || user.email_confirmed_at || dismissed) {
    return null;
  }

  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setResending(true);
    
    try {
      // Resend verification email through Supabase
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verified`
        }
      });

      if (error) {
        throw error;
      }

      // Send our custom styled email
      try {
        await supabase.functions.invoke('send-verification-email', {
          body: {
            email: user.email,
            confirmationUrl: `${window.location.origin}/email-verified`,
            userType: user.user_metadata?.user_type || 'customer'
          },
        });
      } catch (customEmailError) {
        console.warn('Custom email failed, but Supabase email sent:', customEmailError);
      }

      toast.success('Verification email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Error resending verification:', error);
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
      <Mail className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong className="text-yellow-800">Please verify your email address</strong>
          <p className="text-yellow-700 text-sm mt-1">
            We sent a verification link to <strong>{user.email}</strong>. Check your inbox and click the link to activate your account.
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendVerification}
            disabled={resending}
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
          >
            {resending ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend Email'
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-yellow-600 hover:text-yellow-700"
          >
            ✕
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default EmailVerificationBanner;