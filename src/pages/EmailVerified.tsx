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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 relative overflow-hidden">
      <Helmet>
        <title>Email Verified | Mansa Musa Marketplace</title>
      </Helmet>
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mansablue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />
      
      <Card className="w-full max-w-md relative z-10 bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-2xl">
        {verificationStatus === 'loading' && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-mansablue/20 border border-mansablue/30">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansablue"></div>
              </div>
              <CardTitle className="text-xl bg-gradient-to-r from-mansablue to-mansagold bg-clip-text text-transparent">Verifying Your Email</CardTitle>
              <CardDescription className="text-slate-300">
                Please wait while we confirm your email address...
              </CardDescription>
            </CardHeader>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-500/20 border border-green-500/30">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-xl bg-gradient-to-r from-mansablue to-mansagold bg-clip-text text-transparent">Email Verified!</CardTitle>
              <CardDescription className="text-slate-300">
                Welcome to Mansa Musa Marketplace! Your account is now active.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-green-500/10 border-green-500/30">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-slate-300">
                  Your email has been successfully verified. You now have full access to all features.
                </AlertDescription>
              </Alert>
              
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-4">
                  Redirecting you to {user?.user_metadata?.user_type === 'business' ? 'your dashboard' : 'the business directory'} in {countdown} seconds...
                </p>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={() => navigate(user?.user_metadata?.user_type === 'business' ? '/dashboard' : '/directory')}
                    className="w-full bg-gradient-to-r from-mansablue to-mansagold hover:from-mansablue/90 hover:to-mansagold/90"
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
                  
                  <Button variant="outline" onClick={() => navigate('/')} className="w-full border-white/20 hover:bg-white/5">
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
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-yellow-500/20 border border-yellow-500/30">
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
              <CardTitle className="text-xl text-white">Link Expired</CardTitle>
              <CardDescription className="text-slate-300">
                This verification link has expired. Please request a new one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-slate-300">
                  Verification links expire after 24 hours for security. Please log in and request a new verification email.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/login')} className="w-full bg-gradient-to-r from-mansablue to-mansagold hover:from-mansablue/90 hover:to-mansagold/90">
                  Go to Login
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="w-full border-white/20 hover:bg-white/5">
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
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <CardTitle className="text-xl text-white">Verification Failed</CardTitle>
              <CardDescription className="text-slate-300">
                We couldn't verify your email address. This link may be invalid or expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-slate-300">
                  There was an error verifying your email. Please try again or contact support if the problem persists.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/login')} className="w-full bg-gradient-to-r from-mansablue to-mansagold hover:from-mansablue/90 hover:to-mansagold/90">
                  Go to Login
                </Button>
                <Button variant="outline" onClick={() => navigate('/contact')} className="w-full border-white/20 hover:bg-white/5">
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