import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Home, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const EmailVerified: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the verification tokens from URL params
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (!token_hash || type !== 'email') {
          setVerificationStatus('error');
          return;
        }

        // Verify the email with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'email'
        });

        if (error) {
          console.error('Email verification error:', error);
          if (error.message.includes('expired')) {
            setVerificationStatus('expired');
          } else {
            setVerificationStatus('error');
          }
          return;
        }

        if (data.user) {
          setVerificationStatus('success');
          toast.success('Email verified successfully! Welcome to Mansa Musa Marketplace.');
          
          // Start countdown for redirect
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                // Redirect based on user type
                const userType = data.user.user_metadata?.user_type;
                if (userType === 'business') {
                  navigate('/dashboard');
                } else {
                  navigate('/directory');
                }
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        }
      } catch (error) {
        console.error('Verification process error:', error);
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Helmet>
        <title>Email Verified | Mansa Musa Marketplace</title>
      </Helmet>
      
      <Card className="w-full max-w-md">
        {verificationStatus === 'loading' && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-blue-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansablue"></div>
              </div>
              <CardTitle className="text-xl">Verifying Your Email</CardTitle>
              <CardDescription>
                Please wait while we confirm your email address...
              </CardDescription>
            </CardHeader>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Email Verified!</CardTitle>
              <CardDescription>
                Welcome to Mansa Musa Marketplace! Your account is now active.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your email has been successfully verified. You now have full access to all features.
                </AlertDescription>
              </Alert>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Redirecting you to {user?.user_metadata?.user_type === 'business' ? 'your dashboard' : 'the business directory'} in {countdown} seconds...
                </p>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={() => navigate(user?.user_metadata?.user_type === 'business' ? '/dashboard' : '/directory')}
                    className="w-full"
                  >
                    {user?.user_metadata?.user_type === 'business' ? (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Go to Dashboard
                      </>
                    ) : (
                      <>
                        <Home className="h-4 w-4 mr-2" />
                        Explore Businesses
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {verificationStatus === 'expired' && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-yellow-100">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-xl">Link Expired</CardTitle>
              <CardDescription>
                This verification link has expired. Please request a new one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Verification links expire after 24 hours for security. Please log in and request a new verification email.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/login')} className="w-full">
                  Go to Login
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">Verification Failed</CardTitle>
              <CardDescription>
                We couldn't verify your email address. This link may be invalid or expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  There was an error verifying your email. Please try again or contact support if the problem persists.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/login')} className="w-full">
                  Go to Login
                </Button>
                <Button variant="outline" onClick={() => navigate('/contact')} className="w-full">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default EmailVerified;