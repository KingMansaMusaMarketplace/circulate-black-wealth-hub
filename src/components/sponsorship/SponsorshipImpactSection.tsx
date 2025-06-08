
import React from 'react';
import { Users, TrendingUp, Award } from 'lucide-react';

const SponsorshipImpactSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-mansablue mb-12">
          The Impact of Your Partnership
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Users className="h-12 w-12 text-mansagold mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Growth</h3>
            <p className="text-gray-600">
              Support the growth of Black-owned businesses and create sustainable economic opportunities.
            </p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-mansagold mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Economic Circulation</h3>
            <p className="text-gray-600">
              Help keep dollars circulating within Black communities, building generational wealth.
            </p>
          </div>
          <div className="text-center">
            <Award className="h-12 w-12 text-mansagold mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Brand Alignment</h3>
            <p className="text-gray-600">
              Align your brand with meaningful social impact and authentic community engagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipImpactSection;
