import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap, Building2 } from 'lucide-react';
import { subscriptionTiers, type SubscriptionTier } from '@/lib/services/subscription-tiers';
import { subscriptionService } from '@/lib/services/subscription-service';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';

interface SubscriptionPlansProps {
  currentTier?: SubscriptionTier;
  onPlanSelect?: (tier: SubscriptionTier) => void;
}

const tierIcons = {
  free: Star,
  premium: Crown,
  business: Building2,
  enterprise: Zap
};

const tierColors = {
  free: 'bg-gray-100 text-gray-800',
  premium: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  business: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
  enterprise: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
};

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  currentTier = 'free', 
  onPlanSelect 
}) => {
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [loading, setLoading] = useState<SubscriptionTier | null>(null);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    if (tier === 'free') {
      toast.info('You are already on the free plan');
      onPlanSelect?.(tier);
      return;
    }

    setLoading(tier);
    try {
      // Map tier to appropriate userType
      const userType = (tier === 'business' || tier === 'enterprise') ? 'business' : 'customer';
      
      console.log('Creating checkout session for:', { tier, userType, email: user.email });
      
      const checkoutData = await subscriptionService.createCheckoutSession({
        userType: userType,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        tier: tier,
      });
      
      console.log('Checkout session created:', checkoutData);
      
      // Open checkout in new tab
      window.open(checkoutData.url, '_blank');
      
      // Refresh subscription after a delay to check for updates
      setTimeout(() => {
        refreshSubscription();
      }, 2000);
      
      toast.success('Redirecting to checkout...');
      onPlanSelect?.(tier);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start subscription process';
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {Object.entries(subscriptionTiers).map(([key, tier]) => {
        const tierKey = key as SubscriptionTier;
        const Icon = tierIcons[tierKey];
        const isCurrentTier = currentTier === tierKey;
        const isLoading = loading === tierKey;
        
        return (
          <Card 
            key={tierKey} 
            className={`relative transition-all duration-300 hover:shadow-lg ${
              tier.popular ? 'ring-2 ring-mansablue scale-105' : ''
            } ${isCurrentTier ? 'ring-2 ring-mansagold' : ''}`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-mansablue text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            {isCurrentTier && (
              <div className="absolute -top-4 right-4">
                <Badge className="bg-mansagold text-white px-3 py-1">
                  Current Plan
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${tierColors[tierKey]}`}>
                <Icon className="h-8 w-8" />
              </div>
              
              <CardTitle className="text-xl font-bold">
                {tier.displayName}
              </CardTitle>
              
              <CardDescription className="text-sm">
                {tier.description}
              </CardDescription>
              
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  ${tier.price}
                </span>
                {tier.price > 0 && (
                  <span className="text-gray-500">/{tier.interval}</span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>QR Code Scanning</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Earn Loyalty Points</span>
                </div>

                {tier.features.canRedeemRewards && (
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Redeem Rewards</span>
                  </div>
                )}

                {tier.features.canAccessExclusiveDeals && (
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Exclusive Deals</span>
                  </div>
                )}

                {tier.features.canCreateBusiness && (
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Create Business Profile</span>
                  </div>
                )}

                {tier.features.canAccessAnalytics && (
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Analytics Dashboard</span>
                  </div>
                )}

                {tier.features.maxQRCodes > 0 && (
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>
                      {tier.features.maxQRCodes === -1 
                        ? 'Unlimited QR Codes' 
                        : `${tier.features.maxQRCodes} QR Codes`
                      }
                    </span>
                  </div>
                )}

                {tier.features.canAccessMentorship && (
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Mentorship Access</span>
                  </div>
                )}

                {tier.features.canAccessPremiumSupport && (
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Premium Support</span>
                  </div>
                )}
              </div>

              <Button 
                className={`w-full mt-6 ${
                  isCurrentTier 
                    ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
                    : tier.popular 
                      ? 'bg-mansablue hover:bg-mansablue-dark' 
                      : ''
                }`}
                onClick={() => handleSubscribe(tierKey)}
                disabled={isCurrentTier || isLoading}
              >
                {isLoading ? (
                  'Processing...'
                ) : isCurrentTier ? (
                  'Current Plan'
                ) : tier.price === 0 ? (
                  'Current Plan'
                ) : (
                  `Subscribe for $${tier.price}/${tier.interval}`
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;
