
import React from 'react';
import { motion } from 'framer-motion';

interface BenefitsHeaderProps {
  isVisible: boolean;
}

const BenefitsHeader: React.FC<BenefitsHeaderProps> = ({ isVisible }) => {
  return (
    <motion.div 
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="heading-lg text-mansablue mb-4">Member Benefits</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Mansa Musa Marketplace offers unique advantages for both customers and business owners.
      </p>
    </motion.div>
  );
};

export default BenefitsHeader;
