
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
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Business Plan</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the plan that best fits your business needs. Both plans include a 30-day free trial.
        </p>
      </div>
      
      <RadioGroup 
        value={selectedTier} 
        onValueChange={(value) => onTierChange(value as SubscriptionTier)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
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
              className={`relative block h-full cursor-pointer transition-all duration-200 ${
                selectedTier === plan.id 
                  ? 'transform scale-105' 
                  : 'hover:transform hover:scale-102'
              }`}
            >
              <Card className={`h-full border-2 transition-all duration-200 ${
                selectedTier === plan.id 
                  ? 'border-mansablue shadow-xl shadow-mansablue/20 bg-gradient-to-br from-mansablue/5 to-transparent' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
              } ${plan.popular ? 'ring-2 ring-mansagold/50' : ''}`}>
                
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-mansagold text-mansablue font-semibold px-4 py-1 text-sm shadow-lg">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-xl ${
                      selectedTier === plan.id 
                        ? 'bg-mansablue text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {plan.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-base">
                        {plan.description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="text-center py-4 border-t border-gray-100">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-lg text-gray-500 font-medium">/month</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
                      What's Included
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <Check className="h-4 w-4 text-green-500" />
                          </div>
                          <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
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
