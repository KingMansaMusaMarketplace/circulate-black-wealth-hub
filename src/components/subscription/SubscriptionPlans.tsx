
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Star, Crown, Building, Users, Rocket, Info } from 'lucide-react';
import { useSubscriptionActions } from './hooks/useSubscriptionActions';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';
import { shouldHideStripePayments } from '@/utils/platform-utils';

interface SubscriptionPlansProps {
  currentTier?: SubscriptionTier;
  userType?: 'customer' | 'business';
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  currentTier = 'free', 
  userType = 'customer' 
}) => {
  const { loading, handleSubscribe, isAuthenticated } = useSubscriptionActions();

  const customerPlans = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Community Member',
      price: 0,
      period: 'month',
      description: '100% Free Forever - All Features Included',
      features: [
        'Browse complete business directory',
        'Discover businesses near you',
        'Earn loyalty points on purchases',
        'Redeem points for rewards',
        'Access exclusive member deals',
        'Join mentorship programs',
        'Network with the community'
      ],
      icon: <Users className="h-6 w-6" />,
      buttonText: 'Current Plan',
      popular: true
    }
  ];

  const businessPlans = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Free Directory Listing',
      price: 0,
      period: 'month',
      description: 'Get discovered — list your business for free',
      features: [
        'Business directory listing',
        'Basic profile page',
        'Community access',
        'Mentorship & networking',
      ],
      icon: <Rocket className="h-6 w-6" />,
      buttonText: 'Current Plan',
      popular: false
    },
    {
      id: 'business_pro' as SubscriptionTier,
      name: 'Business Pro',
      price: 29,
      period: 'month',
      description: 'Everything you need to grow',
      features: [
        'Analytics dashboard',
        'Booking system',
        'Review management',
        'Up to 25 QR codes',
        'Priority support',
        'Business verification',
      ],
      icon: <Building className="h-6 w-6" />,
      buttonText: 'Start Free Trial',
      popular: false
    },
    {
      id: 'business_pro_kayla' as SubscriptionTier,
      name: 'Business Pro + Kayla AI',
      price: 99,
      period: 'month',
      description: 'Your autonomous AI employee',
      features: [
        'Everything in Business Pro',
        'Kayla AI Employee (28 services)',
        'AI review responses',
        'Tax prep & legal templates',
        'Investment readiness scoring',
        'Unlimited QR codes',
      ],
      icon: <Building className="h-6 w-6" />,
      buttonText: 'Get Kayla AI',
      popular: true
    }
  ];

  const plans = userType === 'business' ? businessPlans : customerPlans;

  const getButtonVariant = (planId: SubscriptionTier) => {
    if (currentTier === planId) return 'outline';
    if (userType === 'business' && planId === 'business_pro_kayla') return 'default';
    return 'outline';
  };

  const getButtonText = (plan: any) => {
    if (currentTier === plan.id) return 'Current Plan';
    return plan.buttonText;
  };

  const isButtonDisabled = (planId: SubscriptionTier) => {
    return currentTier === planId || loading === planId;
  };

  const hidePayments = shouldHideStripePayments();

  return (
    <div className="space-y-6">
      {hidePayments && userType === 'business' && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Business subscriptions are managed through our web platform. Please visit our website to subscribe or manage your subscription.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
              {userType === 'business' && (
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

            {!hidePayments ? (
              <>
                <Button
                  className={`w-full cursor-pointer ${
                    plan.popular 
                      ? 'bg-mansagold hover:bg-mansagold/90 text-mansablue' 
                      : currentTier === plan.id
                        ? 'bg-green-500 hover:bg-green-600'
                        : ''
                  }`}
                  variant={getButtonVariant(plan.id)}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isButtonDisabled(plan.id) || !isAuthenticated}
                  style={{ touchAction: 'manipulation' }}
                >
                  <span className="pointer-events-none">
                    {loading === plan.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      getButtonText(plan)
                    )}
                  </span>
                </Button>

                {!isAuthenticated && (
                  <p className="text-xs text-center text-gray-500">
                    Please log in to subscribe
                  </p>
                )}
              </>
            ) : (
              <div className="text-center text-sm text-gray-600 py-3">
                Visit our website to subscribe
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
