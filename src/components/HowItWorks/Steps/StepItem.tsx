
import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepDetail {
  number: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
}

interface StepItemProps {
  step: StepDetail;
  index: number;
  activeStep: number | null;
  setActiveStep: (index: number | null) => void;
  children: React.ReactNode;
}

const StepItem: React.FC<StepItemProps> = ({ 
  step, 
  index, 
  activeStep, 
  setActiveStep,
  children 
}) => {
  return (
    <motion.div 
      key={step.number}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5 }
        }
      }}
      onMouseEnter={() => setActiveStep(index)}
      onMouseLeave={() => setActiveStep(null)}
      className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
    >
      <div className="md:w-1/2">
        <div className="mb-2 flex items-center">
          <motion.span 
            className="text-5xl mr-4"
            animate={activeStep === index ? { scale: 1.2 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {step.icon}
          </motion.span>
          <span className="text-mansagold font-bold text-xl">{step.number}</span>
        </div>
        <h2 className="heading-md text-mansablue-dark mb-3">{step.title}</h2>
        <p className="text-gray-600 text-lg mb-4">{step.description}</p>
        
        <div className="space-y-2">
          {step.details.map((detail, i) => (
            <div key={i} className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-mansagold mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{detail}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="md:w-1/2">
        {children}
      </div>
    </motion.div>
  );
};

export default StepItem;
