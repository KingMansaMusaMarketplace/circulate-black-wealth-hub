
import React from 'react';
import { motion } from 'framer-motion';

interface DiscoveryStepProps {
  isHovered: boolean;
}

const DiscoveryStep: React.FC<DiscoveryStepProps> = ({ isHovered }) => {
  return (
    <motion.div 
      className={`backdrop-blur-xl bg-white/10 rounded-xl p-4 border transition-all duration-300 border-yellow-400/50`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(251, 191, 36, 0.3)' }}
    >
      <div className="backdrop-blur-xl bg-white/5 rounded-lg shadow-sm p-6 border border-white/20">
        <h3 className="font-bold text-white mb-4">Search & Discovery</h3>
        
        <div className="space-y-4">
          <div className="border border-white/20 rounded-lg p-3 bg-white/5">
            <div className="flex items-center">
              <div className="bg-blue-500/20 rounded-full p-2 mr-3">🍽️</div>
              <div>
                <h5 className="font-semibold text-white">Restaurants</h5>
                <p className="text-sm text-white/70">56 nearby</p>
              </div>
            </div>
          </div>
          
          <div className="border border-white/20 rounded-lg p-3 bg-white/5">
            <div className="flex items-center">
              <div className="bg-blue-500/20 rounded-full p-2 mr-3">✂️</div>
              <div>
                <h5 className="font-semibold text-white">Beauty & Barber</h5>
                <p className="text-sm text-white/70">42 nearby</p>
              </div>
            </div>
          </div>
          
          <div className="border border-white/20 rounded-lg p-3 bg-white/5">
            <div className="flex items-center">
              <div className="bg-blue-500/20 rounded-full p-2 mr-3">🛍️</div>
              <div>
                <h5 className="font-semibold text-white">Retail</h5>
                <p className="text-sm text-white/70">38 nearby</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiscoveryStep;
