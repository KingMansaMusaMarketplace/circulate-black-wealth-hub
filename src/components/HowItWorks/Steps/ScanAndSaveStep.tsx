
import React from 'react';
import { motion } from 'framer-motion';

interface ScanAndSaveStepProps {
  isHovered: boolean;
}

const ScanAndSaveStep: React.FC<ScanAndSaveStepProps> = ({ isHovered }) => {
  return (
    <motion.div 
      className={`backdrop-blur-xl bg-white/10 rounded-xl p-4 border transition-all duration-300 border-blue-400/50`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)' }}
    >
      <div className="backdrop-blur-xl bg-white/5 rounded-lg shadow-sm p-6 border border-white/20">
        <h3 className="font-bold text-white mb-4">QR Code & Loyalty</h3>
        
        <div className="flex items-center justify-center mb-6">
          <div className="w-40 h-40 bg-black rounded-lg grid grid-cols-8 grid-rows-8 gap-0.5 p-2">
            {Array(64).fill(0).map((_, i) => (
              <div key={i} className={`${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'} rounded-sm`}></div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border border-white/20 rounded-lg p-4 bg-white/5">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-white/70">SB</span>
                </div>
                <h5 className="font-medium text-white">Soul Bistro</h5>
              </div>
              <span className="text-yellow-400 font-bold">15% Off</span>
            </div>
            <div className="mt-3 bg-blue-500/20 rounded p-2 text-center">
              <span className="text-sm font-medium text-blue-300">+15 Points Earned!</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1 text-white/90">
              <span>Loyalty Progress</span>
              <span>350/500 pts</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5">
              <div className="bg-yellow-400 h-2.5 rounded-full" style={{width: '70%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScanAndSaveStep;
