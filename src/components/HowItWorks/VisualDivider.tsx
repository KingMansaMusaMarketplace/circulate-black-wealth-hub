
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
    <div className="visual-divider bg-gradient-to-br from-purple-100 via-blue-100 to-amber-100 relative overflow-hidden py-16">
      <div className="container-custom h-full flex items-center justify-center">
        <div className="max-w-4xl w-full flex justify-between items-center relative">
          {/* Left element */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-right pr-6">Community</div>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-blue-500 rounded-full shadow-md"></div>
          </motion.div>
          
          {/* Central element */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative mx-8 z-10"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-400 via-blue-400 to-amber-400 rounded-full blur-xl opacity-70 animate-pulse"></div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-mansagold via-amber-500 to-orange-500 flex items-center justify-center relative shadow-2xl">
              <CircleDollarSign className="text-white w-10 h-10 drop-shadow-lg" />
              
              {/* Animated pulse effect */}
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-white/50"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 0.2, 0.8]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              ></motion.div>
            </div>
            
            {/* Flow arrows animation */}
            <motion.div 
              className="absolute top-1/2 -left-12 transform -translate-y-1/2"
              animate={{ x: [-8, 8, -8] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <ArrowRight className="text-blue-500 w-6 h-6 rotate-180 drop-shadow-md" />
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 -right-12 transform -translate-y-1/2"
              animate={{ x: [-8, 8, -8] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <ArrowRight className="text-amber-500 w-6 h-6 drop-shadow-md" />
            </motion.div>
          </motion.div>
          
          {/* Right element */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="text-2xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent pl-6">Circulation</div>
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-transparent rounded-full shadow-md"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisualDivider;
