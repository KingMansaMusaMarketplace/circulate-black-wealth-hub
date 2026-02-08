import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Loader2,
  DollarSign,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface StripeConnectOnboardingProps {
  onStatusChange?: (status: 'pending' | 'active' | 'not_created') => void;
}

const StripeConnectOnboarding: React.FC<StripeConnectOnboardingProps> = ({ 
  onStatusChange 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [connectStatus, setConnectStatus] = useState<{
    connected: boolean;
    status: 'pending' | 'active' | 'restricted' | 'not_created' | 'error';
    message?: string;
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
    requirements?: string[];
  } | null>(null);

  useEffect(() => {
    if (user) {
      checkConnectStatus();
    }
  }, [user]);

  const checkConnectStatus = async () => {
    setCheckingStatus(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-host-connect-status');
      
      if (error) throw error;
      
      setConnectStatus(data);
      onStatusChange?.(data.status);
    } catch (err: any) {
      console.error('Error checking Connect status:', err);
      setConnectStatus({
        connected: false,
        status: 'not_created',
        message: 'Unable to check payment status',
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  const startOnboarding = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-host-connect-account', {
        body: {
          returnUrl: `${window.location.origin}/stays/host/dashboard?stripe_connected=true`,
          refreshUrl: `${window.location.origin}/stays/host/dashboard?stripe_refresh=true`,
        },
      });

      if (error) throw error;

      if (data.onboardingUrl) {
        window.open(data.onboardingUrl, '_blank');
        toast.info('Complete your payment setup in the new tab');
      }
    } catch (err: any) {
      console.error('Error starting onboarding:', err);
      toast.error(err.message || 'Failed to start payment setup');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <Card className="bg-slate-800/50 border-white/10">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-mansagold mr-2" />
          <span className="text-white/60">Checking payment status...</span>
        </CardContent>
      </Card>
    );
  }

  if (connectStatus?.status === 'active') {
    return (
      <Card className="bg-green-500/10 border-green-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Payments Active
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-white/70">
            Your Stripe Connect account is fully set up. You'll automatically receive 
            92.5% of each booking directly to your bank account.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-400">
              <CreditCard className="w-4 h-4" />
              <span>Charges enabled</span>
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <DollarSign className="w-4 h-4" />
              <span>Payouts enabled</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://dashboard.stripe.com/express', '_blank')}
            className="mt-2"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Stripe Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (connectStatus?.status === 'pending' || connectStatus?.status === 'restricted') {
    return (
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            Setup Incomplete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-white/70">
            {connectStatus.message || 'Your payment account setup is incomplete. Please complete the verification process.'}
          </p>
          {connectStatus.requirements && connectStatus.requirements.length > 0 && (
            <div className="bg-yellow-500/10 rounded-lg p-3">
              <p className="text-yellow-400 text-sm font-medium mb-1">Required information:</p>
              <ul className="text-white/60 text-sm space-y-1">
                {connectStatus.requirements.slice(0, 3).map((req, i) => (
                  <li key={i}>• {req.replace(/_/g, ' ')}</li>
                ))}
                {connectStatus.requirements.length > 3 && (
                  <li>• and {connectStatus.requirements.length - 3} more...</li>
                )}
              </ul>
            </div>
          )}
          <Button 
            onClick={startOnboarding}
            disabled={loading}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <ExternalLink className="w-4 h-4 mr-2" />
            )}
            Complete Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Not created state
  return (
    <Card className="bg-slate-800/50 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-mansagold" />
          Set Up Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-white/70">
          Connect your bank account to receive payouts for your bookings. 
          Powered by Stripe for secure, fast payments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <DollarSign className="w-6 h-6 text-mansagold mx-auto mb-1" />
            <p className="text-white text-sm font-medium">92.5% Payout</p>
            <p className="text-white/50 text-xs">You keep most of your earnings</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <Shield className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <p className="text-white text-sm font-medium">Secure</p>
            <p className="text-white/50 text-xs">Bank-level security</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <CreditCard className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-white text-sm font-medium">Daily Payouts</p>
            <p className="text-white/50 text-xs">Get paid quickly</p>
          </div>
        </div>

        <Button 
          onClick={startOnboarding}
          disabled={loading}
          className="w-full bg-mansagold text-black hover:bg-mansagold/90"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <ExternalLink className="w-4 h-4 mr-2" />
          )}
          Connect with Stripe
        </Button>

        <p className="text-white/40 text-xs text-center">
          You'll be redirected to Stripe to complete verification. 
          This typically takes 5-10 minutes.
        </p>
      </CardContent>
    </Card>
  );
};

export default StripeConnectOnboarding;
