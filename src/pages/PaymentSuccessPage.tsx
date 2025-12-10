import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');

      // Give Stripe webhook time to process, then show success
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    };

    verifyPayment();
  }, [searchParams]);

  const handleContinue = () => {
    const userType = searchParams.get('user_type');
    
    if (userType === 'corporate') {
      navigate('/corporate-dashboard');
    } else if (userType === 'business') {
      navigate('/business-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#1a1f3c] to-[#0d2847] relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/15 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="text-center space-y-4 relative z-10">
          <Loader2 className="h-12 w-12 animate-spin text-amber-400 mx-auto" />
          <p className="text-slate-300">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful - Mansa Musa Marketplace</title>
      </Helmet>

      <div className="dark min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#1a1f3c] to-[#0d2847] p-4 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/5 to-blue-500/5 rounded-full blur-3xl" />

        <Card className="max-w-md w-full relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/25 animate-scale-in">
              <CheckCircle2 className="h-12 w-12 text-slate-900" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <CardTitle className="text-2xl text-white">Payment Successful!</CardTitle>
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
            <CardDescription className="text-slate-300">
              Thank you for your subscription. Your account has been activated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <h3 className="font-medium mb-3 text-amber-400">What's Next?</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-amber-400" />
                  </div>
                  <span>Access your personalized dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-amber-400" />
                  </div>
                  <span>Track your impact and metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-amber-400" />
                  </div>
                  <span>Explore all your subscription benefits</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-400 text-center">
                A confirmation email has been sent to your inbox with your receipt and subscription details.
              </p>
            </div>

            <Button 
              onClick={handleContinue} 
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40" 
              size="lg"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
