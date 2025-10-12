
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Calendar, TrendingUp } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { getTierDisplayName, getTierInfo, type SubscriptionTier } from '@/lib/services/subscription-tiers';
import { Link } from 'react-router-dom';

const SubscriptionStatusWidget: React.FC = () => {
  const { subscriptionInfo, openCustomerPortal } = useSubscription();
  
  const currentTier = (subscriptionInfo?.subscription_tier as SubscriptionTier) || 'free';
  const tierInfo = getTierInfo(currentTier);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crown className="h-5 w-5 text-mansagold" />
          Your Subscription
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Badge 
              variant={currentTier === 'free' ? 'secondary' : 'default'}
              className={`
                ${currentTier.includes('business') ? 'bg-blue-500' : ''}
                ${currentTier === 'enterprise' ? 'bg-amber-500' : ''}
              `}
            >
              {getTierDisplayName(currentTier)}
            </Badge>
          </div>
          
          {tierInfo.price > 0 && (
            <div className="text-right">
              <p className="text-xl font-bold">${tierInfo.price}</p>
              <p className="text-xs text-gray-500">per {tierInfo.interval}</p>
            </div>
          )}
        </div>

        {subscriptionInfo?.subscription_end && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {subscriptionInfo.subscribed ? 'Renews' : 'Expires'} on{' '}
              {formatDate(subscriptionInfo.subscription_end)}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {currentTier === 'free' ? (
            <Link to="/subscription" className="flex-1">
              <Button className="w-full bg-mansablue hover:bg-mansablue-dark">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </Link>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={openCustomerPortal}
                className="flex-1"
              >
                Manage
              </Button>
              <Link to="/subscription" className="flex-1">
                <Button variant="outline" className="w-full">
                  Change Plan
                </Button>
              </Link>
            </>
          )}
        </div>

        {currentTier !== 'enterprise' && (
          <div className="text-center pt-2">
            <Link 
              to="/subscription" 
              className="text-sm text-mansablue hover:underline"
            >
              See all features & upgrade options →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatusWidget;
