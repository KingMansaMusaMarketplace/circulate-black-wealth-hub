
import React from 'react';
import { motion } from 'framer-motion';

interface CirculationStatsProps {
  isVisible: boolean;
}

const CirculationStats = ({ isVisible }: CirculationStatsProps) => (
  <motion.div 
    className="mt-6 bg-gray-50 rounded-xl p-4 text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    transition={{ duration: 0.7, delay: 0.9 }}
  >
    <p className="text-lg text-gray-700 mb-1">
      <strong className="text-mansablue">The Dollar Multiplier Effect:</strong> A dollar spent at a Black-owned business stays in the community for...
    </p>
    <p className="text-4xl font-bold text-mansagold mb-2">6 Hours</p>
    <p className="text-gray-500">Compared to 6 minutes in other communities</p>
    <div className="flex justify-center mt-3">
      <div className="bg-mansablue px-4 py-1 rounded-full text-sm text-white">
        <span className="font-bold">Our Goal:</span> Increase to 6+ Days
      </div>
    </div>
  </motion.div>
);

export default CirculationStats;
