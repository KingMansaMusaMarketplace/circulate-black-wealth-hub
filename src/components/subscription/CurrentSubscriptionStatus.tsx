
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
      case 'business_starter_annual':
        return 'Starter Business';
      case 'business':
      case 'business_annual':
        return 'Professional Business';
      case 'business_multi_location':
      case 'business_multi_location_annual':
        return 'Multi-Location Business';
      case 'enterprise':
        return 'Enterprise';
      default:
        return 'Community Member';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto backdrop-blur-xl bg-slate-800/60 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-mansagold" />
          <span className="text-white">Your Current Plan</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-lg text-white">
              {getTierDisplayName(currentTier)}
            </p>
            {subscriptionEnd && (
              <p className="text-sm text-slate-400">
                Renews on {new Date(subscriptionEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          
          {isSubscribed && (
            <Button 
              variant="outline" 
              onClick={onManageSubscription}
              className="text-mansagold border-mansagold hover:bg-mansagold hover:text-slate-900"
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
