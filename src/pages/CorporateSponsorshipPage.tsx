
import React from 'react';
import { Helmet } from 'react-helmet';
import { Building2, Star, Users, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CorporateSponsorshipPage = () => {
  const sponsorshipTiers = [
    {
      name: 'Silver Sponsor',
      price: '$500/month',
      features: [
        'Logo placement on website',
        'Mention in monthly newsletter',
        'Social media shout-outs',
        'Basic analytics dashboard'
      ],
      color: 'bg-gray-100'
    },
    {
      name: 'Gold Sponsor',
      price: '$1,000/month',
      features: [
        'Premium logo placement',
        'Featured in newsletter',
        'Dedicated social media posts',
        'Advanced analytics',
        'Co-branded content opportunities'
      ],
      color: 'bg-yellow-100',
      popular: true
    },
    {
      name: 'Platinum Sponsor',
      price: '$2,500/month',
      features: [
        'Hero logo placement',
        'Newsletter header sponsorship',
        'Weekly social media features',
        'Full analytics suite',
        'Co-branded events',
        'Direct customer introductions'
      ],
      color: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Corporate Sponsorship | Mansa Musa Marketplace</title>
        <meta name="description" content="Partner with Mansa Musa Marketplace to support Black-owned businesses and reach engaged customers." />
      </Helmet>

      <DashboardLayout title="Corporate Sponsorship" icon={<Building2 className="h-5 w-5 mr-2" />}>
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Corporate Sponsorship</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Partner with us to support Black-owned businesses while reaching an engaged community of conscious consumers
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-mansablue" />
                  <div>
                    <p className="text-2xl font-bold">10,000+</p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-8 w-8 text-mansablue" />
                  <div>
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-sm text-gray-600">Partner Businesses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-mansablue" />
                  <div>
                    <p className="text-2xl font-bold">$2M+</p>
                    <p className="text-sm text-gray-600">Economic Impact</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sponsorship Tiers */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Sponsorship Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sponsorshipTiers.map((tier, index) => (
                <Card key={index} className={`relative ${tier.color} ${tier.popular ? 'ring-2 ring-mansablue' : ''}`}>
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-mansablue">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-center">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{tier.name}</h3>
                        <p className="text-2xl font-bold text-mansablue">{tier.price}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-mansablue fill-current" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6 bg-mansablue hover:bg-mansablue-dark">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Ready to Partner With Us?</h3>
                <p className="text-gray-600">
                  Contact our partnership team to discuss custom sponsorship opportunities
                </p>
                <Button size="lg" className="bg-mansablue hover:bg-mansablue-dark">
                  Contact Partnership Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default CorporateSponsorshipPage;
