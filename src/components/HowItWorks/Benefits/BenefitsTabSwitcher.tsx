
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BenefitsTabSwitcherProps {
  activeTab: 'customers' | 'businesses';
  setActiveTab: (tab: 'customers' | 'businesses') => void;
}

const BenefitsTabSwitcher: React.FC<BenefitsTabSwitcherProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="inline-flex rounded-lg p-1 bg-gray-200">
      <motion.button
        onClick={() => setActiveTab('customers')}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md transition-all",
          activeTab === 'customers' 
            ? "bg-white text-mansablue shadow-sm" 
            : "text-gray-600 hover:text-mansablue"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        For Customers
      </motion.button>
      <motion.button
        onClick={() => setActiveTab('businesses')}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md transition-all",
          activeTab === 'businesses' 
            ? "bg-white text-mansablue shadow-sm" 
            : "text-gray-600 hover:text-mansablue"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        For Business Owners
      </motion.button>
    </div>
  );
};

export default BenefitsTabSwitcher;
