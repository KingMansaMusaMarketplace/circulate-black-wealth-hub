
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, ArrowRight } from 'lucide-react';

const VisualDivider: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const divider = document.querySelector('.visual-divider');
    if (divider) observer.observe(divider);
    
    return () => {
      if (divider) observer.unobserve(divider);
    };
  }, []);
  
  return (
    <div className="visual-divider bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden h-32 py-4">
      <div className="container-custom h-full flex items-center justify-center">
        <div className="max-w-4xl w-full flex justify-between items-center relative">
          {/* Left element */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="text-sm font-semibold text-mansablue text-right pr-4">Community</div>
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent to-mansablue/70"></div>
          </motion.div>
          
          {/* Central element */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative mx-4 z-10"
          >
            <div className="absolute -inset-2 bg-gradient-to-tr from-mansablue to-mansagold/50 rounded-full blur-md opacity-70"></div>
            <div className="w-16 h-16 rounded-full bg-mansablue flex items-center justify-center relative">
              <CircleDollarSign className="text-white w-8 h-8" />
              
              {/* Animated pulse effect */}
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-mansagold"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.2, 0.7]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              ></motion.div>
            </div>
            
            {/* Flow arrows animation */}
            <motion.div 
              className="absolute top-1/2 -left-8 transform -translate-y-1/2"
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <ArrowRight className="text-mansablue/70 w-5 h-5 rotate-180" />
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 -right-8 transform -translate-y-1/2"
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <ArrowRight className="text-mansagold/70 w-5 h-5" />
            </motion.div>
          </motion.div>
          
          {/* Right element */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="text-sm font-semibold text-mansagold pl-4">Circulation</div>
            <div className="h-0.5 w-full bg-gradient-to-r from-mansagold/70 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisualDivider;
