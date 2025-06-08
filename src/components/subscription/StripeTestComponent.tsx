
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { subscriptionService } from '@/lib/services/subscription-service';
import { toast } from 'sonner';
import { CreditCard, Refresh, ExternalLink } from 'lucide-react';

const StripeTestComponent: React.FC = () => {
  const { user } = useAuth();
  const { subscriptionInfo, refreshSubscription, openCustomerPortal, isLoading } = useSubscription();
  const [testLoading, setTestLoading] = useState(false);

  const handleTestCheckout = async () => {
    if (!user) {
      toast.error('Please log in to test checkout');
      return;
    }

    setTestLoading(true);
    try {
      const checkoutData = await subscriptionService.createCheckoutSession({
        userType: 'customer',
        email: user.email || '',
        name: user.user_metadata?.name || 'Test User',
        tier: 'premium'
      });
      
      window.open(checkoutData.url, '_blank');
      toast.success('Checkout session created successfully!');
    } catch (error) {
      console.error('Test checkout error:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setTestLoading(false);
    }
  };

  const handleTestBusinessCheckout = async () => {
    if (!user) {
      toast.error('Please log in to test checkout');
      return;
    }

    setTestLoading(true);
    try {
      const checkoutData = await subscriptionService.createCheckoutSession({
        userType: 'business',
        email: user.email || '',
        name: user.user_metadata?.name || 'Test User',
        businessName: 'Test Business',
        tier: 'business'
      });
      
      window.open(checkoutData.url, '_blank');
      toast.success('Business checkout session created successfully!');
    } catch (error) {
      console.error('Test business checkout error:', error);
      toast.error('Failed to create business checkout session');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Stripe Payment System Test
        </CardTitle>
        <CardDescription>
          Test the Stripe payment integration and subscription management
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Subscription Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">Current Subscription Status</h3>
          <div className="flex items-center gap-2">
            <Badge variant={subscriptionInfo?.subscribed ? 'default' : 'secondary'}>
              {subscriptionInfo?.subscription_tier || 'free'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSubscription}
              disabled={isLoading}
              className="ml-auto"
            >
              <Refresh className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          {subscriptionInfo?.subscription_end && (
            <p className="text-sm text-gray-600">
              Subscription ends: {new Date(subscriptionInfo.subscription_end).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Test Checkout Buttons */}
        <div className="space-y-3">
          <h3 className="font-semibold">Test Checkout Sessions</h3>
          
          <Button
            onClick={handleTestCheckout}
            disabled={testLoading || !user}
            className="w-full"
            variant="outline"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Test Premium Customer Checkout ($10/month)
          </Button>
          
          <Button
            onClick={handleTestBusinessCheckout}
            disabled={testLoading || !user}
            className="w-full"
            variant="outline"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Test Business Checkout ($100/month)
          </Button>
        </div>

        {/* Customer Portal */}
        {subscriptionInfo?.subscribed && (
          <div className="space-y-2">
            <h3 className="font-semibold">Subscription Management</h3>
            <Button
              onClick={openCustomerPortal}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Customer Portal
            </Button>
          </div>
        )}

        {/* System Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">System Status</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>User Authenticated: <Badge variant={user ? 'default' : 'destructive'}>{user ? 'Yes' : 'No'}</Badge></div>
            <div>Subscription Loaded: <Badge variant={subscriptionInfo ? 'default' : 'secondary'}>{subscriptionInfo ? 'Yes' : 'No'}</Badge></div>
          </div>
        </div>

        {!user && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              Please log in to test the Stripe payment system.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeTestComponent;
