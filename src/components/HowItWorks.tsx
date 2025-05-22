
import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronRight, MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

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
    },
    {
      number: '04',
      title: 'Find Nearby',
      description: 'Use GPS to locate Black-owned businesses around you and see exactly how many are nearby.',
      icon: '📍'
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
          className="grid md:grid-cols-4 gap-6"
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

        {/* New GPS Location Feature Highlight */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-mansablue to-mansablue-dark rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <Navigation className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">GPS-Powered Business Discovery</h3>
              </div>
              
              <p className="mb-6 text-white/90">
                Our directory uses your location to show you exactly how many Black-owned businesses 
                from the Mansa Musa Marketplace are around you.
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-mansagold mt-0.5" />
                  <span>See businesses sorted by exact distance from your location</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-mansagold mt-0.5" />
                  <span>Filter by distance ranges (under 1 mile, 1-5 miles, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-mansagold mt-0.5" />
                  <span>Get directions to any business with a single tap</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-mansagold mt-0.5" />
                  <span>Discover new businesses you might not have known were nearby</span>
                </li>
              </ul>
              
              <Link to="/directory">
                <motion.button
                  className="bg-white text-mansablue font-medium px-5 py-2.5 rounded-md hover:bg-opacity-90 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Directory
                </motion.button>
              </Link>
            </div>
            
            <div className="bg-mansablue-light/20 p-8 flex items-center justify-center relative">
              <div className="relative w-full max-w-xs">
                <div className="w-full h-64 bg-gray-800 rounded-xl overflow-hidden relative">
                  {/* Simulated map view with locations */}
                  <div className="absolute inset-0 bg-mansablue-dark/60">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-white flex items-center justify-center">
                      <div className="h-6 w-6 rounded-full bg-blue-500 animate-pulse"/>
                    </div>
                    
                    {/* Business pins */}
                    <div className="absolute top-[30%] left-[60%]">
                      <MapPin className="h-5 w-5 text-mansagold" />
                    </div>
                    <div className="absolute top-[40%] left-[30%]">
                      <MapPin className="h-5 w-5 text-mansagold" />
                    </div>
                    <div className="absolute top-[60%] left-[45%]">
                      <MapPin className="h-5 w-5 text-mansagold" />
                    </div>
                    <div className="absolute top-[70%] left-[65%]">
                      <MapPin className="h-5 w-5 text-mansagold" />
                    </div>
                    
                    {/* Distance circles */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full h-32 w-32 border border-white/20"/>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full h-64 w-64 border border-white/10"/>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-lg -mt-6 mx-auto relative z-10 max-w-[90%]">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Businesses Near You:</p>
                    <div className="flex justify-between mt-1">
                      <div className="text-center">
                        <p className="text-mansablue font-bold text-xl">4</p>
                        <p className="text-xs text-gray-500">Under 1mi</p>
                      </div>
                      <div className="text-center">
                        <p className="text-mansablue font-bold text-xl">8</p>
                        <p className="text-xs text-gray-500">Under 5mi</p>
                      </div>
                      <div className="text-center">
                        <p className="text-mansablue font-bold text-xl">15</p>
                        <p className="text-xs text-gray-500">Under 10mi</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
