import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim(),
});

interface PasswordResetFormProps {
  onBack: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate email
      const validated = resetSchema.parse({ email });
      
      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(
        validated.email,
        {
          redirectTo: `${window.location.origin}/password-reset`,
        }
      );

      if (error) {
        throw error;
      }

      // Send custom styled email via edge function
      try {
        await supabase.functions.invoke('send-password-reset', {
          body: {
            email: validated.email,
            resetUrl: `${window.location.origin}/password-reset`,
          },
        });
      } catch (emailError) {
        console.warn('Custom email failed, using default:', emailError);
      }

      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Unable to send reset email';
      
      if (error.errors) {
        errorMessage = error.errors[0].message;
      } else if (error.message) {
        // Handle common Supabase errors with friendly messages
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          errorMessage = 'No account found with this email address. Please check your email or sign up.';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many attempts. Please wait a few minutes and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      toast.error('Password Reset Failed', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a password reset link to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Click the link in your email to reset your password. The link will expire in 1 hour for security.
            </AlertDescription>
          </Alert>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              className="w-full"
            >
              Try Different Email
            </Button>
          </div>
          
          <Button variant="ghost" onClick={onBack} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
          
          <Button variant="ghost" onClick={onBack} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetForm;