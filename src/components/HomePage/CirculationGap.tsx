import React from 'react';
import { Clock } from 'lucide-react';

const CirculationGap: React.FC = () => {
  return (
    <section className="py-3 md:py-8 bg-gradient-to-b from-mansablue-dark/50 to-mansablue-dark">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-black/90 border border-mansagold/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
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
            <p className="text-base md:text-lg text-gray-300 max-w-xl">
              The Black dollar leaves our community in 6 hours. Others retain wealth for 28+ days. 
              <span className="text-mansagold font-mono font-medium tracking-wider"> 1325.AI</span> closes this gap.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CirculationGap;
