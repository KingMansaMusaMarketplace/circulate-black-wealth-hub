
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';

interface CurrentSubscriptionStatusProps {
  currentTier: SubscriptionTier;
  subscriptionEnd?: string;
  isSubscribed: boolean;
  onManageSubscription: () => void;
}

const CurrentSubscriptionStatus: React.FC<CurrentSubscriptionStatusProps> = ({
  currentTier,
  subscriptionEnd,
  isSubscribed,
  onManageSubscription
}) => {
  const getTierDisplayName = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return 'Community Member';
      case 'business_starter':
        return 'Starter Business';
      case 'business':
        return 'Professional Business';
      case 'premium':
        return 'Premium Member';
      case 'enterprise':
        return 'Enterprise';
      default:
        return 'Community Member';
    }
  };

  return (
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
              {getTierDisplayName(currentTier)}
            </p>
            {subscriptionEnd && (
              <p className="text-sm text-gray-600">
                Renews on {new Date(subscriptionEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          
          {isSubscribed && (
            <Button 
              variant="outline" 
              onClick={onManageSubscription}
              className="text-mansablue border-mansablue hover:bg-mansablue hover:text-white"
            >
              Manage Subscription
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentSubscriptionStatus;
