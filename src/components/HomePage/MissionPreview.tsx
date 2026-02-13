import React from 'react';

const MissionPreview: React.FC = () => {
  return (
    <section className="py-0 md:py-4 bg-gradient-to-b from-mansablue-dark/50 to-mansablue-dark">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header - EOS Positioning */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mansagold/10 border border-mansagold/30 mb-2">
            <span className="text-xs font-semibold text-mansagold uppercase tracking-wider">Economic Operating System</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Not Just a Directory. <span className="text-mansagold">Infrastructure.</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            <span className="text-mansagold font-mono tracking-wider">1325.AI</span> is the intelligence layer powering Black economic circulation—connecting consumers, 
            businesses, and capital in one unified ecosystem.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionPreview;
