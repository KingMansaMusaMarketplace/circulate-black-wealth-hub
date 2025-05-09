
import React from 'react';
import { motion } from 'framer-motion';
import BenefitCard, { Benefit } from './BenefitCard';

interface BenefitsListProps {
  benefits: Benefit[];
  expandedBenefitIndex: number | null;
  setExpandedBenefit: (index: number | null) => void;
  isCustomer: boolean;
  isVisible: boolean;
}

const BenefitsList: React.FC<BenefitsListProps> = ({ 
  benefits, 
  expandedBenefitIndex, 
  setExpandedBenefit, 
  isCustomer,
  isVisible
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedBenefit(expandedBenefitIndex === index ? null : index);
  };

  return (
    <motion.div 
      className="grid md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {benefits.map((benefit, index) => (
        <motion.div key={index} variants={itemVariants}>
          <BenefitCard 
            benefit={benefit}
            isExpanded={expandedBenefitIndex === index}
            onToggle={() => toggleExpand(index)}
            isCustomer={isCustomer}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BenefitsList;
