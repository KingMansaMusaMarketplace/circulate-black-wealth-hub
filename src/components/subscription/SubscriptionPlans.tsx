
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Building, Users } from 'lucide-react';
import { useSubscriptionActions } from './hooks/useSubscriptionActions';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';

interface SubscriptionPlansProps {
  currentTier?: SubscriptionTier;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ currentTier = 'free' }) => {
  const { loading, handleSubscribe, isAuthenticated } = useSubscriptionActions();

  const plans = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Community Member',
      price: 0,
      period: 'month',
      description: 'Perfect for discovering and supporting Black-owned businesses',
      features: [
        'Browse complete business directory',
        'Discover businesses near you',
        'View detailed business profiles',
        'Access contact information',
        'Support community growth'
      ],
      icon: <Users className="h-6 w-6" />,
      buttonText: 'Current Plan',
      popular: false
    },
    {
      id: 'premium' as SubscriptionTier,
      name: 'Premium Member',
      price: 4.99,
      period: 'month',
      description: 'Enhanced experience with exclusive savings and rewards',
      features: [
        'Everything in Community Member',
        'Get 5% - 30% discounts at businesses',
        'Earn loyalty points on purchases',
        'Redeem points for rewards',
        'Access exclusive member deals',
        'Priority customer support',
        'Early access to new features'
      ],
      icon: <Crown className="h-6 w-6" />,
      buttonText: 'Upgrade to Premium',
      popular: true
    },
    {
      id: 'business' as SubscriptionTier,
      name: 'Business Plan',
      price: 100,
      period: 'month',
      description: 'Complete business management and marketing suite',
      features: [
        'Business profile creation & management',
        'QR code generation & analytics',
        'Customer loyalty program',
        'Business analytics dashboard',
        'Marketing tools & promotions',
        'Priority business support',
        '30-day free trial'
      ],
      icon: <Building className="h-6 w-6" />,
      buttonText: 'Start Free Trial',
      popular: false
    }
  ];

  const getButtonVariant = (planId: SubscriptionTier) => {
    if (currentTier === planId) return 'outline';
    if (planId === 'premium') return 'default';
    return 'outline';
  };

  const getButtonText = (plan: any) => {
    if (currentTier === plan.id) return 'Current Plan';
    if (plan.id === 'business') return 'Start Free Trial';
    return plan.buttonText;
  };

  const isButtonDisabled = (planId: SubscriptionTier) => {
    return currentTier === planId || loading === planId;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative ${
            plan.popular 
              ? 'border-mansagold shadow-lg scale-105' 
              : currentTier === plan.id 
                ? 'border-green-500 bg-green-50/30' 
                : 'border-gray-200'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-mansagold text-mansablue font-semibold px-3 py-1">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
          )}

          {currentTier === plan.id && (
            <div className="absolute -top-3 right-4">
              <Badge className="bg-green-500 text-white font-semibold px-3 py-1">
                <Check className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          )}

          <CardHeader className="text-center pb-4">
            <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
              plan.popular 
                ? 'bg-mansagold/10 text-mansagold' 
                : currentTier === plan.id 
                  ? 'bg-green-100 text-green-600'
                  : 'bg-mansablue/10 text-mansablue'
            }`}>
              {plan.icon}
            </div>
            
            <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
            <CardDescription className="text-sm">{plan.description}</CardDescription>
            
            <div className="mt-4">
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500 ml-1">/{plan.period}</span>
              </div>
              {plan.id === 'business' && (
                <p className="text-sm text-green-600 mt-1 font-medium">30-day free trial</p>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                plan.popular 
                  ? 'bg-mansagold hover:bg-mansagold/90 text-mansablue' 
                  : currentTier === plan.id
                    ? 'bg-green-500 hover:bg-green-600'
                    : ''
              }`}
              variant={getButtonVariant(plan.id)}
              onClick={() => handleSubscribe(plan.id)}
              disabled={isButtonDisabled(plan.id) || !isAuthenticated}
            >
              {loading === plan.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Processing...
                </>
              ) : (
                getButtonText(plan)
              )}
            </Button>

            {!isAuthenticated && (
              <p className="text-xs text-center text-gray-500">
                Please log in to subscribe
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
