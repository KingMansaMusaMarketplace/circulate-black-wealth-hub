
import React from 'react';
import { Helmet } from 'react-helmet';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, Users, Star } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const { subscriptionInfo, openCustomerPortal } = useSubscription();

  const currentTier = subscriptionInfo?.subscription_tier as any || 'free';

  return (
    <ResponsiveLayout
      title="Subscription Plans"
      description="Choose the perfect plan to maximize your impact in the Black business community"
    >
      <Helmet>
        <title>Subscription Plans | Mansa Musa Marketplace</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Crown className="h-16 w-16 text-mansagold" />
          </div>
          
          <h1 className="text-4xl font-bold text-mansablue">
            Choose Your Impact Level
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of community members circulating Black wealth. 
            Every subscription helps strengthen our economic ecosystem.
          </p>
        </div>

        {/* Current Subscription Status */}
        {user && subscriptionInfo && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-mansagold" />
                Your Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">
                    {subscriptionInfo.subscription_tier === 'free' 
                      ? 'Community Member' 
                      : subscriptionInfo.subscription_tier?.charAt(0).toUpperCase() + subscriptionInfo.subscription_tier?.slice(1)
                    }
                  </p>
                  {subscriptionInfo.subscription_end && (
                    <p className="text-sm text-gray-600">
                      Renews on {new Date(subscriptionInfo.subscription_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                {subscriptionInfo.subscribed && (
                  <Button 
                    variant="outline" 
                    onClick={openCustomerPortal}
                    className="text-mansablue border-mansablue hover:bg-mansablue hover:text-white"
                  >
                    Manage Subscription
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-mansablue/10 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-mansablue" />
            </div>
            <h3 className="text-xl font-semibold">Maximize Your Impact</h3>
            <p className="text-gray-600">
              Track and amplify your contribution to Black wealth circulation
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-mansagold/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-mansagold" />
            </div>
            <h3 className="text-xl font-semibold">Support Community</h3>
            <p className="text-gray-600">
              Every subscription directly supports Black business growth
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Crown className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Unlock Rewards</h3>
            <p className="text-gray-600">
              Get exclusive access to deals, events, and networking
            </p>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-mansablue mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-600">
              All plans include our core features to support Black-owned businesses
            </p>
          </div>

          <SubscriptionPlans currentTier={currentTier} />
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center space-y-4 pt-12">
          <h3 className="text-2xl font-bold text-mansablue">
            Questions About Subscriptions?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            All subscriptions come with a 30-day money-back guarantee. 
            You can cancel or change your plan anytime.
          </p>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default SubscriptionPage;
