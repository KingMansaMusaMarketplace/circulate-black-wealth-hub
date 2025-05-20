
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeDollarSign, Users, BarChart3, Globe } from 'lucide-react';

const SponsorshipBenefits = () => {
  const benefits = [
    {
      icon: <BadgeDollarSign className="h-12 w-12 text-mansablue" />,
      title: "Economic Impact",
      description: "Your contribution directly supports Black business circulation, with measurable community economic impact metrics."
    },
    {
      icon: <Users className="h-12 w-12 text-mansablue" />,
      title: "Brand Visibility",
      description: "Showcase your brand to thousands of conscious consumers committed to economic justice and community empowerment."
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-mansablue" />,
      title: "Data & Insights",
      description: "Access detailed analytics and reports on community engagement and the direct impact of your contribution."
    },
    {
      icon: <Globe className="h-12 w-12 text-mansablue" />,
      title: "Community Leadership",
      description: "Position your organization as a leader in corporate social responsibility and community economic development."
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Sponsor?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our corporate sponsors gain unique benefits while supporting a platform dedicated to economic empowerment and community development.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipBenefits;
