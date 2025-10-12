import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star } from 'lucide-react';

interface BenefitsSectionProps {
  subscriptionId: string;
  tier: string;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ tier }) => {
  const bronzeBenefits = [
    'Logo placement on marketplace footer',
    'Monthly impact reports',
    'Social media recognition',
    'Access to community events',
    'Basic analytics dashboard',
  ];

  const goldBenefits = [
    ...bronzeBenefits,
    'Featured logo on homepage',
    'Quarterly executive briefings',
    'Co-branded marketing materials',
    'Priority event sponsorship',
    'Advanced analytics & insights',
    'Direct business introductions',
    'Custom impact storytelling',
  ];

  const benefits = tier === 'gold' ? goldBenefits : bronzeBenefits;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Sponsorship Benefits</CardTitle>
              <CardDescription>
                All the perks included in your {tier} tier
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {tier.toUpperCase()} TIER
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {tier === 'bronze' && (
        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <CardTitle>Upgrade to Gold</CardTitle>
            </div>
            <CardDescription>
              Unlock premium benefits and maximize your impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Gold tier sponsors receive enhanced visibility, deeper analytics, 
                and exclusive networking opportunities. Make an even bigger difference 
                while strengthening your brand's commitment to economic equity.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Additional Gold benefits:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Featured homepage placement</li>
                  <li>• Quarterly executive briefings</li>
                  <li>• Co-branded marketing materials</li>
                  <li>• Custom impact storytelling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            New benefits we're adding for our corporate sponsors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Sponsor-exclusive networking events</li>
            <li>• Video impact stories featuring your support</li>
            <li>• Employee volunteer opportunities</li>
            <li>• Custom CSR reports for stakeholders</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BenefitsSection;
