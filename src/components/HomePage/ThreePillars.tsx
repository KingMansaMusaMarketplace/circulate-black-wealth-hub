import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThreePillars: React.FC = () => {
  return (
    <section className="py-6 md:py-8 bg-gradient-to-b from-mansablue-dark/50 to-mansablue-dark">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-lg bg-mansagold/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-mansagold" />
            </div>
            <h3 className="font-semibold text-white mb-2">CMAL Engine</h3>
            <p className="text-gray-400 text-sm">Circulatory Multiplier Attribution Logic tracks every dollar's community journey.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Economic Karma</h3>
            <p className="text-gray-400 text-sm">Earn rewards for every purchase—turn spending into community investment.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">B2B Marketplace</h3>
            <p className="text-gray-400 text-sm">Black businesses buying from Black businesses—supply chain sovereignty.</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link to="/about">
            <Button 
              variant="outline" 
              className="border-mansagold/50 text-mansagold hover:bg-mansagold/10 hover:border-mansagold group"
            >
              Learn More
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ThreePillars;
