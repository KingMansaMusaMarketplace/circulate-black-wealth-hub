
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Building, Users, Rocket } from 'lucide-react';
import { useSubscriptionActions } from './hooks/useSubscriptionActions';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';
import { shouldHideStripePayments } from '@/utils/platform-utils';

interface PlanData {
  id: SubscriptionTier;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  icon: React.ReactElement;
  buttonText: string;
  popular: boolean;
  monthlyEquivalent?: number;
  savingsText?: string;
}

interface SubscriptionPlansWithToggleProps {
  currentTier?: SubscriptionTier;
  userType?: 'customer' | 'business';
}

const SubscriptionPlansWithToggle: React.FC<SubscriptionPlansWithToggleProps> = ({ 
  currentTier = 'free', 
  userType = 'customer' 
}) => {
  const { loading, handleSubscribe, isAuthenticated } = useSubscriptionActions();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const isIOS = shouldHideStripePayments();

  // On iOS, don't show subscription plans
  if (isIOS) {
    return null;
  }

  const customerPlans: { monthly: PlanData[]; annual: PlanData[] } = {
    monthly: [
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
          'Network with the community',
          'View detailed business profiles'
        ],
        icon: <Users className="h-6 w-6" />,
        buttonText: 'Current Plan',
        popular: true
      }
    ],
    annual: [
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
          'Network with the community',
          'View detailed business profiles'
        ],
        icon: <Users className="h-6 w-6" />,
        buttonText: 'Current Plan',
        popular: true
      }
    ]
  };

  const businessPlans: { monthly: PlanData[]; annual: PlanData[] } = {
    monthly: [
      {
        id: 'business_starter' as SubscriptionTier,
        name: 'Starter Business',
        price: 39,
        period: 'month',
        description: 'Perfect for new and small businesses getting started',
        features: [
          'Business profile creation & management',
          'Up to 5 QR codes',
          'Basic analytics dashboard',
          'Customer loyalty program',
          'Email support',
          'Business verification',
          '30-day free trial'
        ],
        icon: <Rocket className="h-6 w-6" />,
        buttonText: 'Start Free Trial',
        popular: false
      },
      {
        id: 'business' as SubscriptionTier,
        name: 'Professional Business',
        price: 79,
        period: 'month',
        description: 'Complete business management and marketing suite',
        features: [
          'Everything in Starter Business',
          'Up to 25 QR codes',
          'Advanced analytics dashboard',
          'Marketing tools & promotions',
          'Event creation & management',
          'Priority business support',
          'Advanced customer insights'
        ],
        icon: <Building className="h-6 w-6" />,
        buttonText: 'Start Free Trial',
        popular: true
      }
    ],
    annual: [
      {
        id: 'business_starter_annual' as SubscriptionTier,
        name: 'Starter Business',
        price: 390,
        period: 'year',
        monthlyEquivalent: 32.50,
        savingsText: 'Save $78/year',
        description: 'Perfect for new and small businesses getting started',
        features: [
          'Business profile creation & management',
          'Up to 5 QR codes',
          'Basic analytics dashboard',
          'Customer loyalty program',
          'Email support',
          'Business verification',
          '30-day free trial'
        ],
        icon: <Rocket className="h-6 w-6" />,
        buttonText: 'Start Free Trial',
        popular: false
      },
      {
        id: 'business_annual' as SubscriptionTier,
        name: 'Professional Business',
        price: 790,
        period: 'year',
        monthlyEquivalent: 65.83,
        savingsText: 'Save $158/year',
        description: 'Complete business management and marketing suite',
        features: [
          'Everything in Starter Business',
          'Up to 25 QR codes',
          'Advanced analytics dashboard',
          'Marketing tools & promotions',
          'Event creation & management',
          'Priority business support',
          'Advanced customer insights'
        ],
        icon: <Building className="h-6 w-6" />,
        buttonText: 'Start Free Trial',
        popular: true
      }
    ]
  };

  const plans = userType === 'business' ? businessPlans[billingCycle] : customerPlans[billingCycle];

  const getButtonVariant = (planId: SubscriptionTier) => {
    if (currentTier === planId) return 'outline';
    if (userType === 'business' && (planId === 'business' || planId === 'business_annual')) return 'default';
    return 'outline';
  };

  const getButtonText = (plan: PlanData) => {
    if (currentTier === plan.id) return 'Current Plan';
    if (userType === 'business' && (plan.id.includes('business'))) {
      return 'Start Free Trial';
    }
    return plan.buttonText;
  };

  const isButtonDisabled = (planId: SubscriptionTier) => {
    return currentTier === planId || loading === planId;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Billing Toggle - Only show for business users */}
      {userType === 'business' && (
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/60 backdrop-blur-xl p-1 rounded-lg flex border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-mansagold text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-mansagold text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Annual
              <Badge className="ml-2 bg-emerald-500 text-white text-xs">Save 17%</Badge>
            </button>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className={`grid grid-cols-1 ${userType === 'business' ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-md mx-auto'} gap-8`}>
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative backdrop-blur-xl ${
              plan.popular 
                ? 'border-mansagold shadow-lg scale-105 bg-slate-800/80' 
                : currentTier === plan.id 
                  ? 'border-emerald-500 bg-slate-800/70' 
                  : 'border-white/10 bg-slate-800/60'
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
                <Badge className="bg-emerald-500 text-white font-semibold px-3 py-1">
                  <Check className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                plan.popular 
                  ? 'bg-mansagold/20 text-mansagold' 
                  : currentTier === plan.id 
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-blue-500/20 text-blue-400'
              }`}>
                {plan.icon}
              </div>
              
              <CardTitle className="text-xl font-bold text-white">{plan.name}</CardTitle>
              <CardDescription className="text-sm text-slate-300">{plan.description}</CardDescription>
              
              <div className="mt-4">
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-slate-400 ml-1">/{plan.period}</span>
                </div>
                {plan.monthlyEquivalent && (
                  <p className="text-sm text-slate-400 mt-1">
                    ${plan.monthlyEquivalent}/month when billed annually
                  </p>
                )}
                {plan.savingsText && (
                  <p className="text-sm text-emerald-400 mt-1 font-medium">{plan.savingsText}</p>
                )}
                {userType === 'business' && (
                  <p className="text-sm text-emerald-400 mt-1 font-medium">30-day free trial</p>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlansWithToggle;
