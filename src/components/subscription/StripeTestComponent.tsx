
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { subscriptionService } from '@/lib/services/subscription-service';
import { toast } from 'sonner';
import { CreditCard, RefreshCw, ExternalLink, User, AlertCircle } from 'lucide-react';

const StripeTestComponent: React.FC = () => {
  const { user } = useAuth();
  const { subscriptionInfo, refreshSubscription, openCustomerPortal, isLoading } = useSubscription();
  const [testLoading, setTestLoading] = useState(false);

  const handleTestCheckout = async (tier: 'premium' | 'business') => {
    if (!user) {
      toast.error('Please log in to test checkout');
      return;
    }

    setTestLoading(true);
    try {
      console.log('Creating test checkout session for:', tier, user.email);
      
      const checkoutData = await subscriptionService.createCheckoutSession({
        userType: tier === 'business' ? 'business' : 'customer',
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Test User',
        tier: tier,
        businessName: tier === 'business' ? 'Test Business LLC' : undefined
      });
      
      console.log('Checkout session created:', checkoutData);
      
      if (checkoutData.url) {
        window.open(checkoutData.url, '_blank');
        toast.success(`${tier} checkout session created successfully!`);
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Test checkout error:', error);
      toast.error(`Failed to create ${tier} checkout session: ${error.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  const handleRefreshSubscription = async () => {
    try {
      console.log('Refreshing subscription status...');
      await refreshSubscription();
      toast.success('Subscription status refreshed');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Failed to refresh subscription status');
    }
  };

  const handleCustomerPortal = async () => {
    try {
      console.log('Opening customer portal...');
      await openCustomerPortal();
    } catch (error) {
      console.error('Customer portal error:', error);
      toast.error('Failed to open customer portal');
    }
  };

  return (
    <div className="space-y-6">
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
          {/* Authentication Status */}
          <div className="space-y-2">
            <h3 className="font-semibold">Authentication Status</h3>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {user ? (
                <div className="flex items-center gap-2">
                  <Badge variant="default">Logged In</Badge>
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Not Logged In</Badge>
                  <span className="text-sm text-gray-600">Please log in to test</span>
                </div>
              )}
            </div>
          </div>

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
                onClick={handleRefreshSubscription}
                disabled={isLoading}
                className="ml-auto"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>
            </div>
            {subscriptionInfo?.subscription_end && (
              <p className="text-sm text-gray-600">
                Subscription ends: {new Date(subscriptionInfo.subscription_end).toLocaleDateString()}
              </p>
            )}
            {subscriptionInfo?.subscribed && (
              <p className="text-sm text-green-600">✓ Active subscription detected</p>
            )}
          </div>

          {/* Test Checkout Buttons */}
          {user ? (
            <div className="space-y-3">
              <h3 className="font-semibold">Test Checkout Sessions</h3>
              
              <Button
                onClick={() => handleTestCheckout('premium')}
                disabled={testLoading}
                className="w-full"
                variant="outline"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {testLoading ? 'Creating...' : 'Test Premium Customer Checkout ($10/month)'}
              </Button>
              
              <Button
                onClick={() => handleTestCheckout('business')}
                disabled={testLoading}
                className="w-full"
                variant="outline"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {testLoading ? 'Creating...' : 'Test Business Checkout ($100/month) - 30 Day Trial'}
              </Button>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium">Test Card Numbers:</p>
                <p>• Success: 4242 4242 4242 4242</p>
                <p>• Decline: 4000 0000 0000 0002</p>
                <p>• Any future date, any CVC, any ZIP</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold">Test Checkout Sessions</h3>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-amber-800 text-sm">
                  Please log in to test checkout functionality
                </span>
              </div>
            </div>
          )}

          {/* Customer Portal */}
          {subscriptionInfo?.subscribed && (
            <div className="space-y-2">
              <h3 className="font-semibold">Subscription Management</h3>
              <Button
                onClick={handleCustomerPortal}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Stripe Customer Portal
              </Button>
              <p className="text-sm text-gray-600">
                Manage your subscription, payment methods, and view billing history
              </p>
            </div>
          )}

          {/* System Debug Information */}
          <div className="space-y-2">
            <h3 className="font-semibold">System Debug Information</h3>
            <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
              <div>User ID: {user?.id || 'Not authenticated'}</div>
              <div>User Email: {user?.email || 'Not available'}</div>
              <div>Subscription Loaded: {subscriptionInfo ? 'Yes' : 'No'}</div>
              <div>Is Loading: {isLoading ? 'Yes' : 'No'}</div>
              <div>Subscribed: {subscriptionInfo?.subscribed ? 'Yes' : 'No'}</div>
              <div>Tier: {subscriptionInfo?.subscription_tier || 'None'}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Related Pages</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/subscription">Subscription Plans</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/system-test">System Test</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/auth">Login/Signup</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StripeTestComponent;
