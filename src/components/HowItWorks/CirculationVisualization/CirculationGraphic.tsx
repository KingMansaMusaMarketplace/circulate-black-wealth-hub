
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Store } from 'lucide-react';
import CirculationNode from './CirculationNode';

interface CirculationGraphicProps {
  isVisible: boolean;
  animationStep: number;
  getHighlightColor: (step: number) => string;
}

const CirculationGraphic = ({ isVisible, animationStep, getHighlightColor }: CirculationGraphicProps) => (
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
);

export default CirculationGraphic;
