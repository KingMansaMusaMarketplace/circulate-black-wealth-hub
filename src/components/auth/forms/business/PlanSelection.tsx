import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Rocket, Building, Star, Check, ChevronDown } from 'lucide-react';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';
import { shouldHideStripePayments } from '@/utils/platform-utils';
import { KAYLA_SERVICE_GROUPS, KAYLA_SERVICE_TOTAL } from './kayla-services';

interface PlanSelectionProps {
  selectedTier: SubscriptionTier;
  onTierChange: (tier: SubscriptionTier) => void;
}

const PlanSelection: React.FC<PlanSelectionProps> = ({
  selectedTier,
  onTierChange
}) => {
  const isIOS = shouldHideStripePayments();
  const [showAllServices, setShowAllServices] = useState(false);

  // On iOS, automatically select free tier
  useEffect(() => {
    if (isIOS && selectedTier !== 'free') {
      onTierChange('free');
    }
  }, [isIOS, selectedTier, onTierChange]);

  // On iOS, don't show plan selection - just show a message
  if (isIOS) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Business Registration</CardTitle>
            <CardDescription className="text-gray-700">
              Complete your business profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white rounded-lg p-6 text-center space-y-4">
              <div className="text-4xl">✨</div>
              <h3 className="text-xl font-semibold text-gray-900">
                Full Platform Access Included
              </h3>
              <p className="text-gray-700">
                Create your business profile and start connecting with customers at no cost.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Complete business profile</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Customer loyalty program</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Basic analytics access</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Community engagement</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const businessPlans = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Free Directory Listing',
      price: 0,
      period: 'month',
      description: 'Get discovered for free',
      features: [
        'Business directory listing',
        'Basic profile page',
        'Community access',
      ],
      icon: <Rocket className="h-6 w-6" />,
      popular: false
    },
    {
      id: 'kayla_essentials' as SubscriptionTier,
      name: 'Essentials',
      price: 19,
      period: 'month',
      description: 'Perfect for businesses just getting started with AI',
      features: [
        'Enhanced directory listing',
        'Kayla AI chat assistant',
        'Community marketplace access',
        'Up to 5 QR codes',
        'Email support',
      ],
      icon: <Building className="h-6 w-6" />,
      popular: false
    },
    {
      id: 'kayla_starter' as SubscriptionTier,
      name: 'Starter',
      price: 79,
      period: 'month',
      description: 'AI-powered records management & business tools',
      features: [
        'Everything in Essentials',
        'AI-powered records management',
        'Document vault & OCR extraction',
        'Up to 25 QR codes',
        'Monthly impact reports',
      ],
      icon: <Building className="h-6 w-6" />,
      popular: false
    },
    {
      id: 'kayla_pro' as SubscriptionTier,
      name: 'Pro',
      price: 299,
      period: 'month',
      description: 'Full suite of 42 AI-powered services',
      features: [
        'Everything in Starter',
        'Full Kayla AI concierge suite (42 services)',
        'B2B matchmaking & connections',
        'Advanced analytics dashboard',
        'Priority support',
        "Founders' Lock: first 100 keep $149/mo for life",
      ],
      icon: <Building className="h-6 w-6" />,
      popular: true
    },
  ];



  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Business Plan</h2>
        <p className="text-lg text-gray-600">
          Select the plan that best fits your business needs. All plans include a 30-day free trial.
        </p>
        <div className="mt-4">
          <Badge className="bg-green-500 text-white px-3 py-1">
            Save 17% with Annual Plans
          </Badge>
        </div>
      </div>
      
      <RadioGroup 
        value={selectedTier} 
        onValueChange={(value) => onTierChange(value as SubscriptionTier)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {businessPlans.map((plan) => (
          <div key={plan.id} className="relative">
            <RadioGroupItem 
              value={plan.id} 
              id={plan.id} 
              className="peer sr-only" 
            />
            <Label
              htmlFor={plan.id}
              className="block cursor-pointer"
            >
              <Card className={`relative transition-all duration-300 hover:shadow-lg ${
                selectedTier === plan.id 
                  ? 'border-2 border-mansablue shadow-lg ring-2 ring-mansablue/20 bg-gradient-to-br from-mansablue/5 to-white' 
                  : 'border border-gray-200 hover:border-gray-300'
              }`}>
                
                {plan.popular && (
                  <div className="absolute -top-3 left-6 z-10">
                    <Badge className="bg-mansagold text-mansablue font-semibold px-3 py-1 shadow-md">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg transition-colors ${
                        selectedTier === plan.id 
                          ? 'bg-mansablue text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {plan.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {plan.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-sm text-gray-500 ml-1">/{plan.period}</span>
                      </div>
                      {(plan as any).monthlyEquivalent && (
                        <p className="text-sm text-gray-600 mt-1">
                          ${(plan as any).monthlyEquivalent}/month
                        </p>
                      )}
                      {(plan as any).savingsText && (
                        <p className="text-sm text-green-600 mt-1 font-medium">{(plan as any).savingsText}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-3">
                      What's Included
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.id === 'kayla_pro' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          aria-expanded={showAllServices}
                          aria-controls="kayla-42-services"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowAllServices((v) => !v);
                          }}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-mansablue hover:text-mansablue/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-mansablue/40 rounded"
                        >
                          {showAllServices ? 'Hide' : 'See all'} {KAYLA_SERVICE_TOTAL} services
                          <ChevronDown
                            className={`h-4 w-4 transition-transform motion-reduce:transition-none ${
                              showAllServices ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {showAllServices && (
                          <div
                            id="kayla-42-services"
                            className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
                          >
                            {KAYLA_SERVICE_GROUPS.map((group) => (
                              <div
                                key={group.department}
                                className="rounded-lg border border-gray-200 bg-gray-50/60 p-3"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-mansablue">
                                    {group.label}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 border-mansagold/40 text-mansablue bg-mansagold/10"
                                  >
                                    {group.services.length}
                                  </Badge>
                                </div>
                                <ul className="space-y-1">
                                  {group.services.map((svc) => (
                                    <li
                                      key={svc}
                                      className="flex items-start gap-1.5 text-xs text-gray-700 leading-snug"
                                    >
                                      <Check className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                                      <span>{svc}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PlanSelection;
