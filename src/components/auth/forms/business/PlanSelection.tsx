import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Rocket, Building, Star, Check } from 'lucide-react';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';

interface PlanSelectionProps {
  selectedTier: SubscriptionTier;
  onTierChange: (tier: SubscriptionTier) => void;
}

const PlanSelection: React.FC<PlanSelectionProps> = ({
  selectedTier,
  onTierChange
}) => {
  const businessPlans = [
    {
      id: 'business_starter' as SubscriptionTier,
      name: 'Starter Business',
      price: 29,
      period: 'month',
      description: 'Perfect for new and small businesses',
      features: [
        'Business profile creation',
        'Up to 3 QR codes',
        'Basic analytics',
        'Email support',
        '30-day free trial'
      ],
      icon: <Rocket className="h-6 w-6" />,
      popular: false
    },
    {
      id: 'business_starter_annual' as SubscriptionTier,
      name: 'Starter Business (Annual)',
      price: 279,
      period: 'year',
      monthlyEquivalent: 23.25,
      savingsText: 'Save $69/year',
      description: 'Perfect for new and small businesses',
      features: [
        'Business profile creation',
        'Up to 3 QR codes',
        'Basic analytics',
        'Email support',
        '30-day free trial'
      ],
      icon: <Rocket className="h-6 w-6" />,
      popular: false
    },
    {
      id: 'business' as SubscriptionTier,
      name: 'Professional Business',
      price: 100,
      period: 'month',
      description: 'Complete business management suite',
      features: [
        'Everything in Starter',
        'Up to 50 QR codes',
        'Advanced analytics',
        'Marketing tools',
        'Priority support'
      ],
      icon: <Building className="h-6 w-6" />,
      popular: false
    },
    {
      id: 'business_annual' as SubscriptionTier,
      name: 'Professional Business (Annual)',
      price: 959,
      period: 'year',
      monthlyEquivalent: 79.92,
      savingsText: 'Save $241/year',
      description: 'Complete business management suite',
      features: [
        'Everything in Starter',
        'Up to 50 QR codes',
        'Advanced analytics',
        'Marketing tools',
        'Priority support'
      ],
      icon: <Building className="h-6 w-6" />,
      popular: true
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Business Plan</h2>
        <p className="text-lg text-gray-600">
          Select the plan that best fits your business needs. Both plans include a 30-day free trial.
        </p>
        <div className="mt-4">
          <Badge className="bg-green-500 text-white px-3 py-1">
            Save 20% with Annual Plans
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
                      {plan.monthlyEquivalent && (
                        <p className="text-sm text-gray-600 mt-1">
                          ${plan.monthlyEquivalent}/month
                        </p>
                      )}
                      {plan.savingsText && (
                        <p className="text-sm text-green-600 mt-1 font-medium">{plan.savingsText}</p>
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
