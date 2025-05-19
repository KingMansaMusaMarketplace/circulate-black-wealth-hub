
import React from 'react';
import { 
  GamificationHeader, 
  GamificationTabs, 
  GamificationFooter 
} from './Gamification';

const GamificationFeatures = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <GamificationHeader />
        <GamificationTabs />
        <GamificationFooter />
      </div>
    </section>
  );
};

export default GamificationFeatures;
