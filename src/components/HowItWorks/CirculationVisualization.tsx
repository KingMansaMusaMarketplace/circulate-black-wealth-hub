
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Store, ArrowRight } from 'lucide-react';

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
    <section id="circulation-visualization" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg text-mansablue mb-4">See The Money Flow</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            When you spend at Black-owned businesses, your money circulates in the community multiple times, creating a stronger economic foundation.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Visualization graphic */}
          <motion.div 
            className="relative h-[300px] md:h-[400px] bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm p-6"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Center text */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-6 bg-white/80 backdrop-blur-sm rounded-full w-40 h-40 flex items-center justify-center border-2 border-mansagold z-10"
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: ['0px 0px 0px rgba(0,0,0,0)', '0px 0px 20px rgba(255,215,0,0.3)', '0px 0px 0px rgba(0,0,0,0)']
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <div>
                <p className="text-mansablue font-bold mb-1">Community</p>
                <p className="text-mansagold text-2xl font-bold">Wealth</p>
              </div>
            </motion.div>
            
            {/* Circulation path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              {/* Main circulation path */}
              <motion.path
                d="M200,50 C300,50 350,150 350,200 C350,250 300,350 200,350 C100,350 50,250 50,200 C50,150 100,50 200,50"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="10"
                strokeLinecap="round"
              />
              
              {/* Animated path */}
              <motion.path
                d="M200,50 C300,50 350,150 350,200 C350,250 300,350 200,350 C100,350 50,250 50,200 C50,150 100,50 200,50"
                fill="none"
                stroke="#2563EB" // mansablue color
                strokeWidth="10"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              
              {/* Animated dollar symbol */}
              <motion.circle 
                cx="0" 
                cy="0" 
                r="15" 
                fill="#FFD700"
                animate={{ 
                  offsetDistance: isVisible ? "100%" : "0%",
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  offsetDistance: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
                }}
                style={{ offsetPath: "path('M200,50 C300,50 350,150 350,200 C350,250 300,350 200,350 C100,350 50,250 50,200 C50,150 100,50 200,50')" }}
              />
              <motion.text
                x="0"
                y="0"
                textAnchor="middle"
                dy=".3em"
                fill="white"
                fontSize="12"
                fontWeight="bold"
                animate={{ 
                  offsetDistance: isVisible ? "100%" : "0%"
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: 0.1
                }}
                style={{ offsetPath: "path('M200,50 C300,50 350,150 350,200 C350,250 300,350 200,350 C100,350 50,250 50,200 C50,150 100,50 200,50')" }}
              >
                $
              </motion.text>
            </svg>
            
            {/* Entities along the path */}
            <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2">
              <CirculationNode 
                icon={<Users className={`h-6 w-6 ${animationStep === 0 ? getHighlightColor(animationStep) : ''}`} />}
                label="Member" 
                isHighlighted={animationStep === 0} 
              />
            </div>
            
            <div className="absolute top-1/2 right-[10%] transform translate-y-[-50%]">
              <CirculationNode 
                icon={<Store className={`h-6 w-6 ${animationStep === 1 ? getHighlightColor(animationStep) : ''}`} />} 
                label="Business" 
                isHighlighted={animationStep === 1} 
              />
            </div>
            
            <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2">
              <CirculationNode 
                icon={<DollarSign className={`h-6 w-6 ${animationStep === 2 ? getHighlightColor(animationStep) : ''}`} />} 
                label="Circulation" 
                isHighlighted={animationStep === 2} 
              />
            </div>
            
            <div className="absolute top-1/2 left-[10%] transform translate-y-[-50%]">
              <CirculationNode 
                icon={<Users className={`h-6 w-6 ${animationStep === 3 ? getHighlightColor(animationStep) : ''}`} />} 
                label="Community" 
                isHighlighted={animationStep === 3} 
              />
            </div>
          </motion.div>
          
          {/* Information Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
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
          <motion.div 
            className="mt-16 bg-gray-50 rounded-xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            <p className="text-lg text-gray-700 mb-2">
              <strong className="text-mansablue">The Dollar Multiplier Effect:</strong> A dollar spent at a Black-owned business stays in the community for...
            </p>
            <p className="text-4xl font-bold text-mansagold mb-4">6 Hours</p>
            <p className="text-gray-500">Compared to 6 minutes in other communities</p>
            <div className="flex justify-center mt-6">
              <div className="bg-mansablue px-4 py-1 rounded-full text-sm text-white">
                <span className="font-bold">Our Goal:</span> Increase to 6+ Days
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Helper components

const CirculationNode = ({ icon, label, isHighlighted }) => (
  <motion.div 
    className={`flex flex-col items-center bg-white p-2 rounded-full shadow-md border-2 ${isHighlighted ? 'border-mansagold' : 'border-transparent'}`}
    animate={isHighlighted ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className={`p-2 rounded-full ${isHighlighted ? 'bg-white' : 'bg-gray-100'}`}>
      {icon}
    </div>
    <p className={`text-xs mt-1 font-medium ${isHighlighted ? 'text-mansagold' : 'text-gray-500'}`}>{label}</p>
  </motion.div>
);

const InfoCard = ({ number, title, description, isVisible, delay }) => (
  <motion.div
    className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
    initial={{ opacity: 0, y: 20 }}
    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    transition={{ duration: 0.6, delay }}
  >
    <div className="flex items-center mb-4">
      <div className="bg-mansablue/10 text-mansablue font-bold rounded-full w-8 h-8 flex items-center justify-center">
        {number}
      </div>
      <ArrowRight className="ml-3 text-mansagold" size={16} />
    </div>
    <h3 className="font-bold text-lg text-mansablue mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default CirculationVisualization;
