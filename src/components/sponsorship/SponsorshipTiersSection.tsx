
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star } from 'lucide-react';

interface SponsorshipTiersSectionProps {
  onLearnMore: (tierName: string) => void;
}

const SponsorshipTiersSection: React.FC<SponsorshipTiersSectionProps> = ({ onLearnMore }) => {
  const tiers = [
    {
      name: 'Silver Partner',
      price: '$2,500/month',
      popular: false,
      features: [
        'Business directory listing highlight',
        'Monthly newsletter inclusion',
        'Social media mentions (2x/month)',
        'Basic analytics reporting',
        'Community event co-branding'
      ]
    },
    {
      name: 'Gold Partner',
      price: '$5,000/month',
      popular: true,
      features: [
        'Premium directory placement',
        'Weekly newsletter spotlight',
        'Social media mentions (4x/month)',
        'Advanced analytics dashboard',
        'Event speaking opportunities',
        'Custom content creation',
        'Quarterly impact reports'
      ]
    },
    {
      name: 'Platinum Partner',
      price: '$10,000/month',
      popular: false,
      features: [
        'Exclusive homepage presence',
        'Daily social media features',
        'Custom partnership landing page',
        'Real-time analytics access',
        'Executive advisory board access',
        'Custom research reports',
        'Annual impact summit participation',
        'Direct community engagement'
      ]
    }
  ];

  return (
    <section id="sponsorship-tiers" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-mansablue mb-4">
            Sponsorship Tiers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the partnership level that aligns with your company's impact goals and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div 
              key={tier.name}
              className={`relative bg-white rounded-lg shadow-lg p-8 ${
                tier.popular ? 'ring-2 ring-mansagold scale-105' : ''
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-mansagold text-mansablue">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-mansablue mb-2">{tier.name}</h3>
                <p className="text-3xl font-bold text-gray-900">{tier.price}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  tier.popular 
                    ? 'bg-mansagold hover:bg-mansagold-dark text-mansablue' 
                    : 'bg-mansablue hover:bg-mansablue-dark text-white'
                }`}
                onClick={() => onLearnMore(tier.name)}
              >
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorshipTiersSection;
