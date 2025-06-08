
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { getFeatureAccess, getTierDisplayName } from '@/lib/services/subscription-tiers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { subscriptionService } from '@/lib/services/subscription-service';

interface FeatureGateProps {
  feature: 'canScanQR' | 'canEarnPoints' | 'canRedeemRewards' | 'canAccessExclusiveDeals';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FeatureGate: React.FC<FeatureGateProps> = ({ feature, children, fallback }) => {
  const { user } = useAuth();
  
  // Get user's subscription tier from metadata
  const subscriptionTier = user?.user_metadata?.subscription_tier || 'free';
  const featureAccess = getFeatureAccess(subscriptionTier);
  const hasAccess = featureAccess[feature];

  const handleUpgrade = async () => {
    try {
      const checkoutData = await subscriptionService.createCheckoutSession({
        userType: 'customer',
        email: user?.email || '',
        name: user?.user_metadata?.name || ''
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
          Upgrade to {getTierDisplayName('paid')} to unlock this feature
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-amber-600">
          <Lock className="h-4 w-4" />
          <span>This feature requires a premium subscription</span>
        </div>
        <Button 
          onClick={handleUpgrade}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
        >
          Upgrade for $10/month
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureGate;
