
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Check } from 'lucide-react';
import { BackgroundDecorations } from './BackgroundDecorations';
import { BenefitsList } from './BenefitsList';
import { CTAButtons } from './CTAButtons';

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const section = document.querySelector('#cta-section');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, [controls]);

  return (
    <section id="cta-section" className="py-14 bg-gradient-to-r from-mansablue to-mansablue-dark text-white text-center relative overflow-hidden">
      <BackgroundDecorations />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2 
            className="heading-lg mb-5 relative inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Ready to Start Circulating?
            <span className="absolute -top-6 -right-6 w-12 h-12 border border-mansagold/30 rounded-full hidden md:block"></span>
          </motion.h2>
          
          <motion.p 
            className="max-w-2xl mx-auto mb-6 text-white/80 text-lg"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Join Mansa Musa Marketplace today and become part of the movement to strengthen Black economic power.
          </motion.p>
          
          <BenefitsList isVisible={isVisible} controls={controls} />
          <CTAButtons isVisible={isVisible} />
          
          <motion.div 
            className="mt-8 text-white/70 text-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <Check size={16} className="text-mansagold mr-2" />
            No credit card required. Cancel your subscription anytime.
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
