
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircleDollarSign, Users, ArrowUpRight, Building } from 'lucide-react';

const SponsorshipImpactStats = () => {
  const stats = [
    {
      icon: <CircleDollarSign className="h-10 w-10 text-mansagold" />,
      value: "$2.4M",
      label: "Circulation Impact",
      description: "Dollars kept within Black communities"
    },
    {
      icon: <Building className="h-10 w-10 text-mansagold" />,
      value: "387",
      label: "Businesses Supported",
      description: "Black-owned businesses on our platform"
    },
    {
      icon: <Users className="h-10 w-10 text-mansagold" />,
      value: "12K+",
      label: "Community Members",
      description: "Active platform users"
    },
    {
      icon: <ArrowUpRight className="h-10 w-10 text-mansagold" />,
      value: "47%",
      label: "Business Growth",
      description: "Average annual revenue increase"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact By The Numbers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our corporate sponsors help us create meaningful economic change. Here's what we've accomplished together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 bg-gray-50 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-lg font-semibold text-mansablue mb-1">{stat.label}</div>
                  <div className="text-gray-500 text-sm">{stat.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipImpactStats;
