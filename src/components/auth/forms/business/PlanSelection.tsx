
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
      icon: <Rocket className="h-5 w-5" />,
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
      icon: <Building className="h-5 w-5" />,
      popular: true
    }
  ];

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose Your Business Plan</CardTitle>
        <CardDescription>
          Select the plan that best fits your business needs. Both plans include a 30-day free trial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedTier} 
          onValueChange={(value) => onTierChange(value as SubscriptionTier)}
          className="space-y-4"
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
                className={`relative block p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedTier === plan.id 
                    ? 'border-mansablue bg-mansablue/5' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${plan.popular ? 'ring-2 ring-mansagold' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-4 bg-mansagold text-mansablue">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header with icon and title */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2 rounded-full ${
                        selectedTier === plan.id ? 'bg-mansablue text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="text-right ml-6">
                    <div className="text-3xl font-bold">${plan.price}</div>
                    <div className="text-sm text-gray-500">/month</div>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PlanSelection;
