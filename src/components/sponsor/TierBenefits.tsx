import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';

interface TierBenefitsProps {
  tier: string;
}

const tierBenefits = {
  bronze: [
    'Company logo on sponsors page',
    'Monthly newsletter mention',
    'Basic analytics dashboard',
    'Community appreciation post',
  ],
  silver: [
    'All Bronze benefits',
    'Featured logo placement',
    'Quarterly spotlight article',
    'Priority customer support',
    'Social media shoutouts (2x/month)',
  ],
  gold: [
    'All Silver benefits',
    'Homepage logo placement',
    'Co-branded event opportunities',
    'Dedicated account manager',
    'Monthly performance reports',
    'Social media shoutouts (4x/month)',
  ],
  platinum: [
    'All Gold benefits',
    'Premium homepage hero placement',
    'Exclusive partnership events',
    'Custom integration opportunities',
    'White-label options available',
    'Weekly performance reports',
    'Priority feature requests',
    'Social media shoutouts (unlimited)',
  ],
};

const tierColors = {
  bronze: 'text-orange-600',
  silver: 'text-gray-600',
  gold: 'text-yellow-600',
  platinum: 'text-purple-600',
};

export const TierBenefits = ({ tier }: TierBenefitsProps) => {
  const benefits = tierBenefits[tier as keyof typeof tierBenefits] || tierBenefits.bronze;
  const color = tierColors[tier as keyof typeof tierColors] || tierColors.bronze;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Star className={`w-6 h-6 ${color}`} />
          <div>
            <CardTitle className="capitalize">{tier} Partner Benefits</CardTitle>
            <CardDescription>Your included sponsorship benefits</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
