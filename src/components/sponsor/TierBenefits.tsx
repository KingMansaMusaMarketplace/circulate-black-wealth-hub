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

const tierGradients = {
  bronze: 'from-orange-500 to-orange-600',
  silver: 'from-gray-400 to-gray-500',
  gold: 'from-amber-500 to-yellow-600',
  platinum: 'from-purple-500 to-purple-600',
};

export const TierBenefits = ({ tier }: TierBenefitsProps) => {
  const benefits = tierBenefits[tier as keyof typeof tierBenefits] || tierBenefits.bronze;
  const gradient = tierGradients[tier as keyof typeof tierGradients] || tierGradients.bronze;

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden relative">
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full" />
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient}`}>
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="capitalize text-amber-100">{tier} Partner Benefits</CardTitle>
            <CardDescription className="text-blue-200/70">Your included sponsorship benefits</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-blue-100">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};