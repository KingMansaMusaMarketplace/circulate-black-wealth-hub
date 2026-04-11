import React from 'react';

const MissionPreview: React.FC = () => {
  return (
    <section id="mission-preview" className="pt-2 pb-2 md:pb-4 bg-gradient-to-b from-[#000000] via-[#050a18] to-[#030712]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mansagold/10 border border-mansagold/30 mb-3">
            <span className="text-xs font-semibold text-mansagold uppercase tracking-wider">Economic Operating System</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Not Just a Directory. <span className="text-mansagold">Infrastructure.</span>
          </h2>
          <p className="text-gray-300 max-w-2xl lg:max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            <span className="text-mansagold font-mono tracking-wider">1325.AI</span> is the intelligence layer powering economic circulation—connecting consumers, 
            businesses, and capital in one unified ecosystem.
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base mt-3">
            One AI employee that handles reviews, marketing, and bookkeeping — so you can focus on the business.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionPreview;
