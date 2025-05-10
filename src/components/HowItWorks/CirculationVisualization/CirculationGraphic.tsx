
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Store } from 'lucide-react';
import CirculationNode from './CirculationNode';

interface CirculationGraphicProps {
  isVisible: boolean;
  animationStep: number;
  getHighlightColor: (step: number) => string;
}

const CirculationGraphic: React.FC<CirculationGraphicProps> = ({
  isVisible,
  animationStep,
  getHighlightColor
}) => {
  // Define the animation variants for better performance
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7 } }
  };

  const pulseAnimation = {
    init: { 
      scale: 1, 
      boxShadow: '0px 0px 0px rgba(0,0,0,0)'
    },
    pulse: { 
      scale: [1, 1.05, 1],
      boxShadow: ['0px 0px 0px rgba(0,0,0,0)', '0px 0px 20px rgba(255,215,0,0.3)', '0px 0px 0px rgba(0,0,0,0)'],
      transition: { duration: 3, repeat: Infinity, repeatType: "reverse" as const }
    }
  };

  const dollarAnimation = {
    init: { offsetDistance: "0%" },
    animate: { 
      offsetDistance: "100%", 
      transition: { duration: 8, repeat: Infinity, ease: "linear" }
    }
  };

  const scaleAnimation = {
    init: { scale: 1 },
    pulse: { 
      scale: [1, 1.2, 1],
      transition: { duration: 1, repeat: Infinity, repeatType: "reverse" as const }
    }
  };

  // Entity positions
  const entities = [
    { label: "Member", position: "top-[10%] left-1/2 transform -translate-x-1/2", icon: <Users />, step: 0 },
    { label: "Business", position: "top-1/2 right-[10%] transform translate-y-[-50%]", icon: <Store />, step: 1 },
    { label: "Circulation", position: "bottom-[10%] left-1/2 transform -translate-x-1/2", icon: <DollarSign />, step: 2 },
    { label: "Community", position: "top-1/2 left-[10%] transform translate-y-[-50%]", icon: <Users />, step: 3 }
  ];

  return (
    <motion.div 
      className="relative h-[300px] md:h-[400px] bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm p-6"
      variants={fadeIn}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Center text */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-6 bg-white/80 backdrop-blur-sm rounded-full w-40 h-40 flex items-center justify-center border-2 border-mansagold z-10"
        variants={pulseAnimation}
        initial="init"
        animate={isVisible ? "pulse" : "init"}
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
          variants={dollarAnimation}
          initial="init"
          animate={isVisible ? "animate" : "init"}
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
          variants={dollarAnimation}
          initial="init"
          animate={isVisible ? "animate" : "init"}
          style={{ offsetPath: "path('M200,50 C300,50 350,150 350,200 C350,250 300,350 200,350 C100,350 50,250 50,200 C50,150 100,50 200,50')" }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear",
            delay: 0.1
          }}
        >
          $
        </motion.text>
      </svg>
      
      {/* Entities along the path */}
      {entities.map((entity, index) => (
        <div key={index} className={`absolute ${entity.position}`}>
          <CirculationNode 
            icon={React.cloneElement(entity.icon as React.ReactElement, { 
              className: `h-6 w-6 ${animationStep === entity.step ? getHighlightColor(animationStep) : ''}`
            })}
            label={entity.label} 
            isHighlighted={animationStep === entity.step} 
          />
        </div>
      ))}
    </motion.div>
  );
};

export default CirculationGraphic;
