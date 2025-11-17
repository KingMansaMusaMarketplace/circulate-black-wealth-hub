
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
    <section id="circulation-visualization" className="py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-lg mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent font-extrabold">
            See The Money Flow
          </h2>
          <p className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent max-w-2xl mx-auto">
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
