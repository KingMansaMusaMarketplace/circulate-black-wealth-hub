import React from 'react';

const MissionPreview: React.FC = () => {
  return (
    <section id="mission-preview" className="py-10 md:py-16 relative">
      {/* Gold accent divider at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-mansagold to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/10 border border-mansagold/30 mb-4">
            <span className="text-xs font-semibold text-mansagold uppercase tracking-wider">Economic Operating System</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Not Just a Directory. <span className="text-mansagold">Infrastructure.</span>
          </h2>
          <p className="text-gray-300 max-w-2xl lg:max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            <span className="text-mansagold font-mono tracking-wider">1325.AI</span> is the intelligence layer powering economic circulation—connecting consumers, 
            businesses, and capital in one unified ecosystem.
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base mt-4 italic">
            One AI employee that handles reviews, marketing, and bookkeeping — so you can focus on the business.
          </p>
          <a
            href="/what-kayla-does"
            className="inline-flex items-center gap-3 mt-6 px-8 py-4 rounded-full bg-mansagold/10 border border-mansagold/30 text-mansagold font-bold text-xl hover:bg-mansagold/20 hover:border-mansagold/50 transition-all duration-300 group"
          >
            <span>28 AI Employees. $149/mo.</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default MissionPreview;
