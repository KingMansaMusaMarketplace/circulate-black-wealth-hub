
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Check } from 'lucide-react';
import { BackgroundDecorations } from './CTASection/BackgroundDecorations';
import { BenefitsList } from './CTASection/BenefitsList';
import { CTAButtons } from './CTASection/CTAButtons';
import ScrollReveal from '@/components/animations/ScrollReveal';

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
    <section id="cta-section" className="py-20 text-white text-center relative overflow-hidden backdrop-blur-xl bg-white/5">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)]" />
      
      <div className="container-custom relative z-10">
        <ScrollReveal delay={0.1}>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
              Ready to <span className="text-yellow-400">Join the Movement</span>?
            </h2>
            
            <p className="font-body text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto">
              Join the FREE Mansa Musa Marketplace community and help build Black economic power together. 
              Phase 1: Everything is FREE until January 2027 as we focus on growing our community!
            </p>
            
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 mb-8 max-w-3xl mx-auto border border-white/20 shadow-2xl">
              <BenefitsList isVisible={isVisible} controls={controls} />
            </div>
            
            <CTAButtons isVisible={isVisible} />
            
            <div className="mt-6 text-white/80 text-sm flex items-center justify-center gap-2">
              <Check size={18} className="text-green-400" />
              <span className="font-body">100% FREE during Phase 1. No credit card required. Community first, revenue later.</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
