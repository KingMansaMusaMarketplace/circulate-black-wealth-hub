
import React from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

const VisualDivider: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white py-4 relative overflow-hidden">
      {/* Background patterns - more subtle */}
      <div className="absolute inset-0 pattern-dots opacity-3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-mansablue/5 to-transparent"></div>
      <div className="absolute top-0 right-0 w-full h-10 bg-gradient-to-b from-mansagold/5 to-transparent"></div>
      
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header with subtle animation - more compact */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-3"
          >
            <h3 className="text-lg font-semibold text-mansablue mb-1">Community Wealth Circulation</h3>
            <p className="text-gray-600 text-xs">
              The path to economic empowerment begins with intentional spending within our community
            </p>
          </motion.div>
          
          {/* Visual circulation pattern - more compact */}
          <div className="relative h-32">
            {/* Central element */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="w-16 h-16 rounded-full bg-mansablue flex items-center justify-center relative">
                <CircleDollarSign className="text-white w-7 h-7" />
                {/* Animated pulse effect */}
                <div className="absolute inset-0 rounded-full border-4 border-mansablue animate-ping opacity-20"></div>
              </div>
            </motion.div>
            
            {/* Circulation paths - outer ring */}
            <motion.div 
              initial={{ opacity: 0, rotate: -10 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute top-1/2 left-1/2 w-32 h-32 transform -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-mansagold/40 rounded-full"
            ></motion.div>
            
            {/* Path nodes - represent businesses and community members - reduced in number */}
            {[0, 120, 240].map((angle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateX(5rem) rotate(-${angle}deg)`,
                }}
              >
                <div className={`w-8 h-8 rounded-full ${i % 2 === 0 ? 'bg-mansagold/30' : 'bg-mansablue/30'} 
                  flex items-center justify-center shadow-sm`}>
                  {i % 3 === 0 ? (
                    <ArrowRight className="text-white w-3 h-3" />
                  ) : i % 3 === 1 ? (
                    <ArrowDown className="text-white w-3 h-3" />
                  ) : (
                    <ArrowUp className="text-white w-3 h-3" />
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Movement indicators - flowing arrows */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
              <motion.path
                d="M150,80 C195,80 225,110 225,150 C225,190 195,220 150,220 C105,220 75,190 75,150 C75,110 105,80 150,80"
                fill="none"
                stroke="#4267A0"
                strokeWidth="1"
                strokeDasharray="4,2"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 50 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              />
              <motion.path
                d="M150,100 C185,100 205,120 205,150 C205,180 185,200 150,200 C115,200 95,180 95,150 C95,120 115,100 150,100"
                fill="none"
                stroke="#E5BB61"
                strokeWidth="1"
                strokeDasharray="4,2"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -50 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              />
            </svg>
          </div>
          
          {/* Stats cards to show impact - more compact */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-2 mt-2"
          >
            {[
              { value: "6-9X", label: "Wealth Multiplier", color: "bg-mansagold/10 border-mansagold/30" },
              { value: "48 hrs", label: "Average Circulation Time", color: "bg-mansablue/10 border-mansablue/30" },
              { value: "2X", label: "Community Impact", color: "bg-mansagold/10 border-mansagold/30" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`${stat.color} border rounded-lg p-1.5 text-center shadow-sm`}
              >
                <p className="text-md font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </motion.div>
          
          {/* Bottom decorative elements - simplified */}
          <div className="flex justify-center mt-2">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-mansablue/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDivider;
