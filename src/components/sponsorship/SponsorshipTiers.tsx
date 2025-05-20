
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SponsorshipTiers = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const tiers = [
    {
      name: "Silver",
      badge: "",
      price: billingPeriod === 'monthly' ? "$2,000" : "$20,000",
      description: "Perfect for medium-sized businesses looking to make an impact",
      benefits: [
        "Featured company logo on marketplace homepage",
        "Access to business analytics dashboard",
        "Monthly report on community economic impact",
        "5 premium business listings",
        "Quarterly sponsor spotlight"
      ]
    },
    {
      name: "Gold",
      badge: "Most Popular",
      price: billingPeriod === 'monthly' ? "$5,000" : "$50,000",
      description: "Ideal for larger corporations committed to community investment",
      benefits: [
        "All Silver benefits",
        "Dedicated account manager",
        "Quarterly spotlight in community newsletter",
        "Co-branded marketing materials",
        "10 premium business listings",
        "Priority customer support",
        "Access to community economic data"
      ]
    },
    {
      name: "Platinum",
      badge: "",
      price: billingPeriod === 'monthly' ? "$10,000" : "$100,000",
      description: "Our premier partnership for maximum impact and visibility",
      benefits: [
        "All Gold benefits",
        "Executive advisory board seat",
        "Featured speaker opportunity at community events",
        "Custom integration options",
        "100 premium business listings",
        "Direct access to leadership team",
        "Custom impact reporting",
        "First access to new marketplace features"
      ]
    }
  ];

  return (
    <div className="py-16 bg-white" id="sponsorship-tiers">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Sponsorship Tiers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the sponsorship level that aligns with your organization's goals and budget.
          </p>
          
          <div className="flex justify-center mt-6">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 rounded-md ${
                  billingPeriod === 'monthly' 
                    ? 'bg-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-2 rounded-md ${
                  billingPeriod === 'yearly' 
                    ? 'bg-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Yearly (Save 15%)
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <Card key={index} className={`border ${tier.badge ? 'border-mansablue shadow-lg' : 'shadow'}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  {tier.badge && <Badge className="bg-mansablue">{tier.badge}</Badge>}
                </div>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-gray-600 ml-2">{billingPeriod === 'monthly' ? '/month' : '/year'}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-mansablue hover:bg-mansablue-dark"
                  onClick={() => {
                    document.getElementById('sponsorship-form')?.scrollIntoView({behavior: 'smooth'});
                  }}
                >
                  Select {tier.name} Tier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipTiers;
