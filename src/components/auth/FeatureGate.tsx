
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { getFeatureAccess, getTierDisplayName, type SubscriptionTier } from '@/lib/services/subscription-tiers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { subscriptionService } from '@/lib/services/subscription-service';
import { Link } from 'react-router-dom';

interface FeatureGateProps {
  feature: 'canScanQR' | 'canEarnPoints' | 'canRedeemRewards' | 'canAccessExclusiveDeals' | 'canCreateBusiness' | 'canVerifyBusiness' | 'canAccessAnalytics' | 'canCreateEvents' | 'canAccessPremiumSupport' | 'canAccessMentorship' | 'canAccessNetworking';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredTier?: SubscriptionTier;
}

const FeatureGate: React.FC<FeatureGateProps> = ({ 
  feature, 
  children, 
  fallback,
  requiredTier = 'premium' 
}) => {
  const { user } = useAuth();
  const { subscriptionInfo } = useSubscription();
  
  // Get user's subscription tier
  const currentTier = (subscriptionInfo?.subscription_tier as SubscriptionTier) || 'free';
  const featureAccess = getFeatureAccess(currentTier);
  const hasAccess = featureAccess[feature];

  const handleUpgrade = async () => {
    try {
      const checkoutData = await subscriptionService.createCheckoutSession({
        userType: requiredTier === 'business' || requiredTier === 'enterprise' ? 'business' : 'customer',
        email: user?.email || '',
        name: user?.user_metadata?.name || '',
        tier: requiredTier === 'free' ? undefined : requiredTier,
      });
      
      window.open(checkoutData.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-amber-800">Premium Feature</CardTitle>
        <CardDescription className="text-amber-700">
          Upgrade to {getTierDisplayName(requiredTier)} to unlock this feature
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-amber-600">
          <Lock className="h-4 w-4" />
          <span>This feature requires a {getTierDisplayName(requiredTier)} subscription</span>
        </div>
        <div className="flex gap-2">
          <Link to="/subscription" className="flex-1">
            <Button variant="outline" className="w-full">
              View Plans
            </Button>
          </Link>
          <Button 
            onClick={handleUpgrade}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            Upgrade Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureGate;
