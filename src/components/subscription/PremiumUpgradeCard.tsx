
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, TrendingUp, Gift, Zap } from 'lucide-react';
import { useSubscriptionActions } from './hooks/useSubscriptionActions';

const PremiumUpgradeCard: React.FC = () => {
  const { loading, handleSubscribe, isAuthenticated } = useSubscriptionActions();

  const premiumBenefits = [
    {
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      title: 'Save 5% - 30%',
      description: 'Get exclusive discounts at participating businesses'
    },
    {
      icon: <Star className="h-5 w-5 text-mansagold" />,
      title: 'Earn Loyalty Points',
      description: 'Collect points with every purchase and scan'
    },
    {
      icon: <Gift className="h-5 w-5 text-purple-500" />,
      title: 'Redeem Rewards',
      description: 'Use points for free products, services, and exclusive deals'
    },
    {
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      title: 'Priority Support',
      description: 'Get faster customer service and early feature access'
    }
  ];

  return (
    <Card className="border-mansagold shadow-lg bg-gradient-to-br from-mansagold/5 to-orange-50">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-mansagold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="h-8 w-8 text-mansagold" />
        </div>
        
        <Badge className="bg-mansagold text-mansablue mb-2 mx-auto w-fit">
          <Star className="h-3 w-3 mr-1" />
          Limited Time Offer
        </Badge>
        
        <CardTitle className="text-2xl font-bold text-mansablue">
          Upgrade to Premium
        </CardTitle>
        
        <CardDescription className="text-lg">
          Unlock exclusive savings and rewards for just $4.99/month
        </CardDescription>
        
        <div className="flex items-baseline justify-center mt-4">
          <span className="text-4xl font-bold text-mansablue">$4.99</span>
          <span className="text-gray-500 ml-1">/month</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {premiumBenefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg">
              <div className="flex-shrink-0">
                {benefit.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-mansablue/5 rounded-lg p-4 text-center">
          <p className="text-sm text-mansablue font-medium mb-2">
            🎯 Average member saves $50+ per month
          </p>
          <p className="text-xs text-gray-600">
            Join thousands of members who are saving money while supporting Black-owned businesses
          </p>
        </div>

        <Button
          className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold py-3"
          onClick={() => handleSubscribe('premium')}
          disabled={loading === 'premium' || !isAuthenticated}
        >
          {loading === 'premium' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Creating Subscription...
            </>
          ) : (
            <>
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium Now
            </>
          )}
        </Button>

        {!isAuthenticated && (
          <p className="text-xs text-center text-gray-500">
            Please log in to upgrade your account
          </p>
        )}

        <p className="text-xs text-center text-gray-500">
          Cancel anytime • 30-day money-back guarantee
        </p>
      </CardContent>
    </Card>
  );
};

export default PremiumUpgradeCard;
