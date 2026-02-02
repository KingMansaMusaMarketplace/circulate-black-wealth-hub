import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MissionPreview: React.FC = () => {
  return (
    <section className="py-6 md:py-8 bg-gradient-to-b from-mansablue-dark/50 to-mansablue-dark">
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
              size="lg"
              className="border-mansagold/50 text-mansagold hover:bg-mansagold/10 hover:border-mansagold group px-8 py-6 text-lg"
            >
              Learn Our Full Story
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* The Problem - Key Stat */}
        <div className="bg-black border-2 border-mansagold/40 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-mansagold/20 to-orange-500/20 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 md:w-10 md:h-10 text-mansagold" />
            </div>
            <p className="text-xs uppercase tracking-wider text-mansagold/80 mb-3 font-medium">The Circulation Gap</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-4">
              <span className="text-4xl md:text-5xl font-bold text-red-500">6 hours</span>
              <span className="text-gray-400 text-xl md:text-2xl font-medium">vs</span>
              <span className="text-4xl md:text-5xl font-bold text-green-400">28+ days</span>
            </div>
            <p className="text-gray-300 text-sm md:text-base max-w-xl">
              The Black dollar leaves our community in 6 hours. Others retain wealth for 28+ days. 
              <span className="text-mansagold font-mono font-medium tracking-wider"> 1325.AI</span> closes this gap.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionPreview;
