
import React from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

const VisualDivider: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden h-24">
      {/* Background patterns - more subtle */}
      <div className="absolute inset-0 pattern-dots opacity-3 pointer-events-none"></div>
      
      <div className="container-custom h-full flex items-center justify-center">
        <div className="max-w-4xl w-full flex justify-between items-center">
          {/* Left element */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="text-xs font-semibold text-mansablue text-right pr-2">Community</div>
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent to-mansablue/30"></div>
          </motion.div>
          
          {/* Central element */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-mansablue flex items-center justify-center relative mx-2">
              <CircleDollarSign className="text-white w-5 h-5" />
              {/* Animated pulse effect */}
              <div className="absolute inset-0 rounded-full border-2 border-mansablue animate-ping opacity-20"></div>
            </div>
          </motion.div>
          
          {/* Right element */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="text-xs font-semibold text-mansagold pl-2">Circulation</div>
            <div className="h-0.5 w-full bg-gradient-to-r from-mansagold/30 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisualDivider;
