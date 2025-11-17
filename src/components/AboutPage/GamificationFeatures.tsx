
import React from 'react';
import { 
  GamificationHeader, 
  GamificationTabs, 
  GamificationFooter 
} from './Gamification';

const GamificationFeatures = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-mansagold/5 relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansagold/15 to-amber-400/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-mansablue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="container-custom relative z-10">
        <GamificationHeader />
        <GamificationTabs />
        <GamificationFooter />
      </div>
    </section>
  );
};

export default GamificationFeatures;
