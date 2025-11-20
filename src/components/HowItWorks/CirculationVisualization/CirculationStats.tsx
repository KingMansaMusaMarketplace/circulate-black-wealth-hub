
import React from 'react';
import { motion } from 'framer-motion';

interface CirculationStatsProps {
  isVisible: boolean;
}

const CirculationStats = ({ isVisible }: CirculationStatsProps) => {
  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7, 
        delay: 0.9 
      }
    }
  };

  return (
    <motion.div 
      className="mt-8 backdrop-blur-xl bg-white/10 rounded-2xl p-8 text-center border-2 border-white/20 shadow-lg"
      variants={statsVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <p className="text-xl font-bold mb-3 text-white">
        <strong>The Dollar Multiplier Effect:</strong> A dollar spent at a Black-owned business stays in the community for...
      </p>
      <p className="text-5xl font-extrabold text-yellow-400 mb-3 drop-shadow-sm">
        6 Hours
      </p>
      <p className="text-lg text-white/90 font-semibold mb-4">Compared to 28+ days in other communities</p>
      <div className="flex justify-center mt-4">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 px-6 py-3 rounded-full text-sm text-white font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <span>Our Goal:</span> Increase to 6+ Days
        </div>
      </div>
    </motion.div>
  );
};

export default CirculationStats;
