import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  StepVideo,
  StepItem, 
  SubscriptionStep, 
  DiscoveryStep, 
  ScanAndSaveStep 
} from './Steps';
import ScrollReveal from '@/components/animations/ScrollReveal';

const HowItWorksSteps = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    const section = document.getElementById('how-it-works');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Subscribe',
      description: 'Join and unlock the full directory of Black-owned businesses.',
      details: [
        'Access to full business listings',
        'QR code scanning functionality',
        'Loyalty points tracking',
        'Exclusive discounts at local businesses'
      ],
      icon: '💳'
    },
    {
      number: '02',
      title: 'Discover',
      description: 'Search by Category, Location, or Distance to find businesses near you.',
      details: [
        'Filter by business category',
        'Search by distance',
        'View ratings and reviews',
        'Find special promotions and discounts'
      ],
      icon: '🔍'
    },
    {
      number: '03',
      title: 'Scan & Save',
      description: 'Visit a business, scan their QR code at checkout, and get instant discounts and loyalty points.',
      details: [
        'Instant discount application',
        'Automatic loyalty points',
        'Track your savings',
        'Build your circulation impact'
      ],
      icon: '📱'
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  
  return (
    <section id="how-it-works" className="py-20 bg-slate-900/40 backdrop-blur-sm relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
      
      <div className="container-custom relative z-10">
        <ScrollReveal delay={0.1}>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-white">
              How It <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="font-body text-lg font-semibold text-blue-100/90 max-w-2xl mx-auto">
              Three simple steps to start supporting Black-owned businesses and building community wealth
            </p>
          </div>
        </ScrollReveal>

        {/* Featured YouTube Video Section */}
        <StepVideo isVisible={isVisible} />

        <motion.div 
          className="space-y-16 mt-16"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <ScrollReveal delay={0.2}>
            <StepItem 
              step={steps[0]} 
              index={0} 
              activeStep={activeStep} 
              setActiveStep={setActiveStep}
            >
              <SubscriptionStep isHovered={activeStep === 0} />
            </StepItem>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <StepItem 
              step={steps[1]} 
              index={1} 
              activeStep={activeStep} 
              setActiveStep={setActiveStep}
            >
              <DiscoveryStep isHovered={activeStep === 1} />
            </StepItem>
          </ScrollReveal>
          
          <ScrollReveal delay={0.4}>
            <StepItem 
              step={steps[2]} 
              index={2} 
              activeStep={activeStep} 
              setActiveStep={setActiveStep}
            >
              <ScanAndSaveStep isHovered={activeStep === 2} />
            </StepItem>
          </ScrollReveal>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSteps;
