import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Check, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { BusinessProfile } from '@/hooks/use-business-profile';

interface StripeConnectContentProps {
  profile: BusinessProfile | null;
}

interface StripeStatus {
  connected: boolean;
  chargesEnabled?: boolean;
  accountId?: string;
}

const StripeConnectContent: React.FC<StripeConnectContentProps> = ({ profile }) => {
  const [status, setStatus] = useState<StripeStatus>({ connected: false });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.id) {
      checkStatus();
    }
  }, [profile?.id]);

  const checkStatus = async () => {
    if (!profile?.id) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke(
        'connect-stripe-account',
        {
          body: {
            businessId: profile.id,
            action: 'status',
          },
        }
      );

      if (error) throw error;

      setStatus(data);
    } catch (error) {
      console.error('Error checking Stripe status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!profile?.id) return;

    setConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke(
        'connect-stripe-account',
        {
          body: {
            businessId: profile.id,
            action: 'create',
          },
        }
      );

      if (error) throw error;

      if (data.url) {
        // Redirect to Stripe onboarding
        window.location.href = data.url;
      } else {
        throw new Error("No onboarding URL received");
      }
    } catch (error) {
      console.error('Error connecting Stripe:', error);
      toast({
        title: "Error",
        description: "Failed to connect Stripe account",
        variant: "destructive"
      });
      setConnecting(false);
    }
  };

  if (!profile?.id) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            <p>Please save your business details first before connecting payments.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <CardTitle>Payment Setup</CardTitle>
        </div>
        <CardDescription>
          Connect your Stripe account to receive payments from bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {!status.connected ? (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need to connect a Stripe account to accept payments from customers.
                    Stripe will collect a 2.9% + $0.30 fee per transaction, and Mansa Musa
                    will collect a 2.5% platform fee.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Secure payments</p>
                      <p className="text-sm text-muted-foreground">
                        Industry-leading security for all transactions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Direct deposits</p>
                      <p className="text-sm text-muted-foreground">
                        Funds are deposited directly to your bank account
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Dashboard & reporting</p>
                      <p className="text-sm text-muted-foreground">
                        Track all payments in your Stripe dashboard
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="w-full"
                  size="lg"
                >
                  {connecting ? (
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
              </>
            ) : (
              <>
                {status.chargesEnabled ? (
                  <Alert className="border-green-200 bg-green-50">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Your Stripe account is connected and ready to accept payments!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      Your Stripe account is connected but not yet fully activated.
                      Please complete your Stripe onboarding to accept payments.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Status</span>
                    <span className={`text-sm font-semibold ${
                      status.chargesEnabled ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {status.chargesEnabled ? 'Active' : 'Pending'}
                    </span>
                  </div>

                  {status.accountId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Account ID</span>
                      <span className="text-sm font-mono text-muted-foreground">
                        {status.accountId.substring(0, 20)}...
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!status.chargesEnabled && (
                    <Button
                      onClick={handleConnect}
                      disabled={connecting}
                      variant="default"
                    >
                      {connecting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Complete Setup'
                      )}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={checkStatus}
                    disabled={loading}
                  >
                    Refresh Status
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                  >
                    Open Stripe Dashboard
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeConnectContent;
