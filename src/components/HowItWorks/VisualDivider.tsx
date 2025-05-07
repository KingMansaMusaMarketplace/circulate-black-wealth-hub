
import React from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

const VisualDivider: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white py-8 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 pattern-dots opacity-5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-mansablue/5 to-transparent"></div>
      <div className="absolute top-0 right-0 w-full h-20 bg-gradient-to-b from-mansagold/5 to-transparent"></div>
      
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header with subtle animation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-6"
          >
            <h3 className="text-xl font-semibold text-mansablue mb-2">Community Wealth Circulation</h3>
            <p className="text-gray-600 text-sm">
              The path to economic empowerment begins with intentional spending within our community
            </p>
          </motion.div>
          
          {/* Visual circulation pattern - made more compact */}
          <div className="relative h-40 md:h-60">
            {/* Central element */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="w-20 h-20 rounded-full bg-mansablue flex items-center justify-center relative">
                <CircleDollarSign className="text-white w-8 h-8" />
                {/* Animated pulse effect */}
                <div className="absolute inset-0 rounded-full border-4 border-mansablue animate-ping opacity-20"></div>
              </div>
            </motion.div>
            
            {/* Circulation paths - outer ring */}
            <motion.div 
              initial={{ opacity: 0, rotate: -10 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="absolute top-1/2 left-1/2 w-48 h-48 md:w-72 md:h-72 transform -translate-x-1/2 -translate-y-1/2 border-4 border-dashed border-mansagold/40 rounded-full"
            ></motion.div>
            
            {/* Path nodes - represent businesses and community members - reduced in number */}
            {[0, 120, 240].map((angle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateX(8rem) rotate(-${angle}deg)`,
                }}
              >
                <div className={`w-10 h-10 rounded-full ${i % 2 === 0 ? 'bg-mansagold/30' : 'bg-mansablue/30'} 
                  flex items-center justify-center shadow-lg`}>
                  {i % 3 === 0 ? (
                    <ArrowRight className="text-white w-4 h-4" />
                  ) : i % 3 === 1 ? (
                    <ArrowDown className="text-white w-4 h-4" />
                  ) : (
                    <ArrowUp className="text-white w-4 h-4" />
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Movement indicators - flowing arrows */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
              <motion.path
                d="M200,80 C260,80 300,120 300,180 C300,240 260,280 200,280 C140,280 100,240 100,180 C100,120 140,80 200,80"
                fill="none"
                stroke="#4267A0"
                strokeWidth="2"
                strokeDasharray="6,3"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 100 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              />
              <motion.path
                d="M180,100 C240,100 280,140 280,200 C280,260 240,300 180,300 C120,300 80,260 80,200 C80,140 120,100 180,100"
                fill="none"
                stroke="#E5BB61"
                strokeWidth="2"
                strokeDasharray="6,3"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -100 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              />
            </svg>
          </div>
          
          {/* Stats cards to show impact - more compact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid md:grid-cols-3 gap-4 mt-4"
          >
            {[
              { value: "6-9X", label: "Wealth Multiplier", color: "bg-mansagold/10 border-mansagold/30" },
              { value: "48 hrs", label: "Average Circulation Time", color: "bg-mansablue/10 border-mansablue/30" },
              { value: "2X", label: "Community Impact", color: "bg-mansagold/10 border-mansagold/30" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`${stat.color} border rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow`}
              >
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </motion.div>
          
          {/* Bottom decorative elements - simplified */}
          <div className="flex justify-center mt-4">
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-mansablue/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDivider;
