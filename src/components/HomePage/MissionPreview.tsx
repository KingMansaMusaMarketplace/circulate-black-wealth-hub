import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MissionPreview: React.FC = () => {
  return (
    <section className="py-8 md:py-10 bg-gradient-to-b from-mansablue-dark/50 to-mansablue-dark">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header - EOS Positioning */}
        <div className="text-center mb-5 md:mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mansagold/10 border border-mansagold/30 mb-4">
            <span className="text-xs font-semibold text-mansagold uppercase tracking-wider">Economic Operating System</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Not Just a Directory. <span className="text-mansagold">Infrastructure.</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            <span className="text-mansagold font-mono tracking-wider">1325.AI</span> is the intelligence layer powering Black economic circulation—connecting consumers, 
            businesses, and capital in one unified ecosystem.
          </p>
        </div>

        {/* CTA - Moved above The Circulation Gap */}
        <div className="text-center mb-5">
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

        {/* The Problem - Key Stat */}
        <div className="bg-gradient-to-br from-red-500/10 via-orange-500/10 to-amber-500/10 border border-mansagold/20 rounded-2xl p-5 md:p-6 mb-5 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-mansagold/20 to-orange-500/20 flex items-center justify-center">
                <Clock className="w-10 h-10 md:w-12 md:h-12 text-mansagold" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs uppercase tracking-wider text-mansagold/80 mb-2 font-medium">The Circulation Gap</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                <span className="text-3xl md:text-4xl font-bold text-red-400">6 hours</span>
                <span className="text-gray-400 text-lg">vs</span>
                <span className="text-3xl md:text-4xl font-bold text-green-400">28+ days</span>
              </div>
              <p className="text-gray-300 text-sm md:text-base max-w-lg">
                The Black dollar leaves our community in 6 hours. Others retain wealth for 28+ days. 
                <span className="text-mansagold font-mono font-medium tracking-wider"> 1325.AI</span> closes this gap.
              </p>
            </div>
          </div>
        </div>

        {/* Three Pillars - EOS Components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-5">
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
      </div>
    </section>
  );
};

export default MissionPreview;
