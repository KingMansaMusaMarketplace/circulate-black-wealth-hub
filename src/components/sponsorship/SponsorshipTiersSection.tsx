
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, TrendingUp, Award } from 'lucide-react';

interface SponsorshipTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  icon: React.ElementType;
  popular?: boolean;
}

interface SponsorshipTiersSectionProps {
  onLearnMore: (tierName: string) => void;
}

const SponsorshipTiersSection: React.FC<SponsorshipTiersSectionProps> = ({ onLearnMore }) => {
  const sponsorshipTiers: SponsorshipTier[] = [
    {
      name: 'Bronze Partner',
      price: '$5,000',
      period: 'annually',
      features: [
        'Logo placement on website footer',
        'Quarterly newsletter mention',
        'Access to community metrics',
        'Certificate of partnership'
      ],
      icon: Award
    },
    {
      name: 'Silver Partner',
      price: '$15,000',
      period: 'annually',
      features: [
        'Logo placement on homepage',
        'Monthly newsletter feature',
        'Sponsored content opportunities',
        'Access to detailed analytics',
        'Dedicated account manager'
      ],
      icon: Star,
      popular: true
    },
    {
      name: 'Gold Partner',
      price: '$35,000',
      period: 'annually',
      features: [
        'Prominent logo placement',
        'Co-branded content creation',
        'Event sponsorship opportunities',
        'Custom partnership benefits',
        'Executive partnership meetings',
        'First access to new initiatives'
      ],
      icon: TrendingUp
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-mansablue mb-12">
          Partnership Opportunities
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {sponsorshipTiers.map((tier, index) => {
            const IconComponent = tier.icon;
            return (
              <Card key={index} className={`relative ${tier.popular ? 'border-mansagold shadow-lg' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-mansagold text-mansablue px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <IconComponent className="h-8 w-8 text-mansagold mx-auto mb-2" />
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-mansablue">{tier.price}</span>
                    <span className="text-gray-600">/{tier.period}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6" 
                    variant={tier.popular ? 'default' : 'outline'}
                    onClick={() => onLearnMore(tier.name)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SponsorshipTiersSection;
