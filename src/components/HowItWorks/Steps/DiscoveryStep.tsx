
import React from 'react';
import { motion } from 'framer-motion';

interface DiscoveryStepProps {
  isHovered: boolean;
}

const DiscoveryStep: React.FC<DiscoveryStepProps> = ({ isHovered }) => {
  return (
    <motion.div 
      className={`bg-gray-50 rounded-xl p-4 border transition-all duration-300 border-mansagold`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Search & Discovery</h3>
        
        <div className="space-y-4">
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center">
              <div className="bg-mansablue/10 rounded-full p-2 mr-3">🍽️</div>
              <div>
                <h5 className="font-semibold">Restaurants</h5>
                <p className="text-sm text-gray-500">56 nearby</p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center">
              <div className="bg-mansablue/10 rounded-full p-2 mr-3">✂️</div>
              <div>
                <h5 className="font-semibold">Beauty & Barber</h5>
                <p className="text-sm text-gray-500">42 nearby</p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center">
              <div className="bg-mansablue/10 rounded-full p-2 mr-3">🛍️</div>
              <div>
                <h5 className="font-semibold">Retail</h5>
                <p className="text-sm text-gray-500">38 nearby</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiscoveryStep;
