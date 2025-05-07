
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CirculationGraphic from './CirculationGraphic';
import CirculationNode from './CirculationNode';
import InfoCard from './InfoCard';
import CirculationStats from './CirculationStats';

const CirculationVisualization = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    const section = document.getElementById('circulation-visualization');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Start the animation sequence when component becomes visible
      const timer = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 4);
      }, 2000);
      
      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const getHighlightColor = (step: number) => {
    switch (step) {
      case 0: return 'text-mansagold';
      case 1: return 'text-mansablue';
      case 2: return 'text-mansagold';
      case 3: return 'text-mansablue';
      default: return '';
    }
  };

  return (
    <section id="circulation-visualization" className="py-12 bg-white">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="heading-lg text-mansablue mb-2">See The Money Flow</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            When you spend at Black-owned businesses, your money circulates in the community multiple times, creating a stronger economic foundation.
          </p>
        </div>
        
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
