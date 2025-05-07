
import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

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
      description: 'Join for just $10/month and unlock the full directory of Black-owned businesses.',
      icon: '💳'
    },
    {
      number: '02',
      title: 'Discover',
      description: 'Search by Category, Location, or Distance to find businesses near you.',
      icon: '🔍'
    },
    {
      number: '03',
      title: 'Scan & Save',
      description: 'Visit a business, scan their QR code at checkout, and get instant discounts and loyalty points.',
      icon: '📱'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-lg text-mansablue mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Mansa Musa Marketplace makes it easy to discover, support, and save at Black-owned businesses.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={step.number} 
              variants={itemVariants}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div 
                className={cn(
                  "bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300 h-full",
                  hoveredStep === index ? "shadow-md transform translate-y-[-5px]" : ""
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.span 
                    className="text-5xl"
                    animate={hoveredStep === index ? { scale: 1.2 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.icon}
                  </motion.span>
                  <motion.span 
                    className="text-mansagold font-bold text-xl"
                    animate={hoveredStep === index ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.number}
                  </motion.span>
                </div>
                <h3 className="font-bold text-xl mb-3 text-mansablue-dark">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                <motion.div 
                  className="mt-4 pt-4 flex items-center text-mansablue font-medium"
                  initial={{ opacity: 0 }}
                  animate={hoveredStep === index ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Learn more <ChevronRight size={16} className="ml-1" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 bg-mansablue-dark rounded-xl p-6 md:p-10 text-white"
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="heading-md mb-4">Member Benefits</h3>
              <ul className="space-y-3">
                {[
                  'Save 10-20% every time you shop',
                  'Earn Loyalty Points redeemable for real rewards',
                  'Exclusive invites to "Circulate the Dollar" events',
                  'Early access to business promotions and limited deals',
                  'Be part of a growing movement — not just a transaction'
                ].map((benefit, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                  >
                    <CheckCircle2 className="h-6 w-6 text-mansagold mr-3 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="heading-md mb-4">Business Owner Benefits</h3>
              <ul className="space-y-3">
                {[
                  'Free first month to try the platform risk-free',
                  'Visibility to a growing base of loyal customers',
                  'Loyalty Points engine to retain customers longer',
                  'Tools to track customer engagement and QR scans',
                  'Increased brand awareness via Featured Business promotions'
                ].map((benefit, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                  >
                    <CheckCircle2 className="h-6 w-6 text-mansagold mr-3 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
