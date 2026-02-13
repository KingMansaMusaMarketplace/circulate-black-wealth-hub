import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MissionPreview: React.FC = () => {
  return (
    <section className="py-3 md:py-8 bg-gradient-to-b from-mansablue-dark/50 to-mansablue-dark">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header - EOS Positioning */}
        <div className="text-center mb-3 md:mb-6">
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
        <div className="text-center mb-3">
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

      </div>
    </section>
  );
};

export default MissionPreview;
