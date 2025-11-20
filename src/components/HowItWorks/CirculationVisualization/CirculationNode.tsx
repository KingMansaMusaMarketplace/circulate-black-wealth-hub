
import React from 'react';
import { motion } from 'framer-motion';

interface CirculationNodeProps {
  icon: React.ReactNode;
  label: string;
  isHighlighted: boolean;
}

const CirculationNode: React.FC<CirculationNodeProps> = ({ icon, label, isHighlighted }) => {
  const nodeVariants = {
    normal: { scale: 1, y: 0 },
    highlighted: { scale: 1.1, y: -5 }
  };

  return (
    <motion.div 
      className={`flex flex-col items-center backdrop-blur-xl bg-white/10 p-2 rounded-full shadow-md border-2 ${isHighlighted ? 'border-yellow-400' : 'border-white/20'}`}
      variants={nodeVariants}
      animate={isHighlighted ? "highlighted" : "normal"}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: isHighlighted ? 1.15 : 1.05 }}
    >
      <div className={`p-2 rounded-full ${isHighlighted ? 'bg-yellow-400/20' : 'bg-white/10'}`}>
        {icon}
      </div>
      <p className={`text-xs mt-1 font-medium ${isHighlighted ? 'text-yellow-400' : 'text-white/80'}`}>{label}</p>
    </motion.div>
  );
};

export default CirculationNode;
