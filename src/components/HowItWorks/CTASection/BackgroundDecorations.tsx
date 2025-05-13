
import React from 'react';

export const BackgroundDecorations: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {/* Larger blurred elements */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-mansagold/10 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-mansagold/5 blur-2xl"></div>
      
      {/* Small decorative elements */}
      <div className="absolute top-10 right-1/4 w-4 h-4 rounded-full bg-white/10"></div>
      <div className="absolute top-1/3 right-10 w-6 h-6 rounded-full border border-white/10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 rounded-full bg-mansagold/30"></div>
      
      {/* Line decorations */}
      <div className="absolute top-20 left-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute bottom-32 right-1/3 w-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      {/* Dots pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-40 opacity-5">
        <div className="pattern-dots h-full"></div>
      </div>
    </div>
  );
};
