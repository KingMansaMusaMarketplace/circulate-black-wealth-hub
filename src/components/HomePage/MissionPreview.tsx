import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MissionPreview: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-mansablue-dark/50 to-mansablue-dark">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Why This <span className="text-mansagold">Matters</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            We're building the infrastructure to keep Black dollars circulating in Black communities.
          </p>
        </div>

        {/* The Problem - Key Stat */}
        <div className="bg-gradient-to-br from-red-500/10 via-orange-500/10 to-amber-500/10 border border-mansagold/20 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-mansagold/20 to-orange-500/20 flex items-center justify-center">
                <Clock className="w-10 h-10 md:w-12 md:h-12 text-mansagold" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                <span className="text-3xl md:text-4xl font-bold text-red-400">6 hours</span>
                <span className="text-gray-400 text-lg">vs</span>
                <span className="text-3xl md:text-4xl font-bold text-green-400">28+ days</span>
              </div>
              <p className="text-gray-300 text-sm md:text-base max-w-lg">
                The Black dollar circulates within our community for less than 6 hours, compared to 28+ days in other groups. 
                <span className="text-mansagold font-medium"> We're changing that.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Three Pillars - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-mansagold/20 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-mansagold" />
            </div>
            <h3 className="font-semibold text-white mb-2">Circulation Infrastructure</h3>
            <p className="text-gray-400 text-sm">Digital bridges supporting intentional economic behavior.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Consumer Empowerment</h3>
            <p className="text-gray-400 text-sm">Turn spending into investing with loyalty rewards.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
              <ArrowRight className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Merchant Growth</h3>
            <p className="text-gray-400 text-sm">Visibility, loyalty programs, and new customer pipelines.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/about">
            <Button 
              variant="outline" 
              className="border-mansagold/50 text-mansagold hover:bg-mansagold/10 hover:border-mansagold group"
            >
              Learn Our Full Story
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MissionPreview;
