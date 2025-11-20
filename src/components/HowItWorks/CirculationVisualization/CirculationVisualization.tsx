
import React from 'react';
import { motion } from 'framer-motion';
import CirculationGraphic from './CirculationGraphic';
import InfoCard from './InfoCard';
import CirculationStats from './CirculationStats';
import useIntersectionObserver from './hooks/useIntersectionObserver';
import useAnimationStep from './hooks/useAnimationStep';
import getHighlightColor from './helpers/colorHelpers';

const CirculationVisualization = () => {
  const isVisible = useIntersectionObserver({ elementId: 'circulation-visualization' });
  const animationStep = useAnimationStep({ isVisible });

  return (
    <section id="circulation-visualization" className="py-12 relative overflow-hidden backdrop-blur-xl bg-white/5">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-lg mb-4 text-white font-extrabold">
            See The Money Flow
          </h2>
          <p className="text-lg font-semibold text-white/90 max-w-2xl mx-auto">
            When you spend at Black-owned businesses, your money circulates in the community multiple times, creating a stronger economic foundation.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          {/* Visualization graphic */}
          <CirculationGraphic 
            isVisible={isVisible} 
            animationStep={animationStep} 
            getHighlightColor={getHighlightColor} 
          />
          
          {/* Information Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <InfoCard 
              number="1"
              title="Members Spend"
              description="Your spending power is directed to Black-owned businesses"
              isVisible={isVisible}
              delay={0.3}
            />
            <InfoCard 
              number="2"
              title="Money Stays"
              description="More money stays in the community when it circulates"
              isVisible={isVisible}
              delay={0.5}
            />
            <InfoCard 
              number="3"
              title="Community Rises"
              description="As circulation grows, community wealth increases"
              isVisible={isVisible}
              delay={0.7}
            />
          </div>
          
          {/* Circulation statistics */}
          <CirculationStats isVisible={isVisible} />
        </div>
      </div>
    </section>
  );
};

export default CirculationVisualization;
