import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { paymentService } from '@/lib/services/payment-service';
import { toast } from 'sonner';

interface ConnectStripeButtonProps {
  businessId: string;
  onConnected?: () => void;
}

const ConnectStripeButton: React.FC<ConnectStripeButtonProps> = ({ businessId, onConnected }) => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAccountStatus();
  }, [businessId]);

  const checkAccountStatus = async () => {
    try {
      setChecking(true);
      const accountData = await paymentService.getPaymentAccount(businessId);
      setAccount(accountData);
    } catch (error) {
      console.error('Error checking account status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      const { url } = await paymentService.connectStripeAccount(businessId);
      
      // Redirect to Stripe Connect onboarding
      window.location.href = url;
    } catch (error) {
      console.error('Error connecting Stripe:', error);
      toast.error('Failed to connect Stripe account');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-mansablue" />
        </CardContent>
      </Card>
    );
  }

  if (account?.account_status === 'active' && account?.charges_enabled) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-900">Payment Processing Active</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            Your Stripe account is connected and ready to accept payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-green-800">
            <p>• Accept credit card payments</p>
            <p>• Automatic payment processing</p>
            <p>• Platform fee: 2.5% per transaction</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (account && !account.charges_enabled) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-900">Account Setup Incomplete</CardTitle>
          </div>
          <CardDescription className="text-yellow-700">
            Your Stripe account needs additional information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleConnect}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Complete Setup
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Accept Payments</span>
        </CardTitle>
        <CardDescription>
          Connect your Stripe account to start accepting payments from customers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-gray-600">
          <p>✓ Accept credit and debit cards</p>
          <p>✓ Secure payment processing</p>
          <p>✓ Automatic payouts to your bank</p>
          <p>✓ Platform fee: 2.5% per transaction</p>
        </div>
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-mansablue hover:bg-mansablue/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Connect with Stripe
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConnectStripeButton;
