
import React from 'react';
import { Users, TrendingUp, Award } from 'lucide-react';

const SponsorshipImpactSection: React.FC = () => {
  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-yellow-400 mb-12">
            The Impact of Your Partnership
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Community Growth</h3>
              <p className="text-blue-200">
                Support the growth of Black-owned businesses and create sustainable economic opportunities.
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Economic Circulation</h3>
              <p className="text-blue-200">
                Help keep dollars circulating within Black communities, building generational wealth.
              </p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Brand Alignment</h3>
              <p className="text-blue-200">
                Align your brand with meaningful social impact and authentic community engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipImpactSection;
