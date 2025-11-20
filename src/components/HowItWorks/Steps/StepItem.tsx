
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
      <div className="md:w-1/2 backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-lg border border-white/20 hover:border-yellow-400/50 transition-all duration-300">
        <div className="mb-4 flex items-center">
          <motion.span 
            className="text-6xl mr-4"
            animate={activeStep === index ? { scale: 1.3, rotate: [0, -10, 10, 0] } : { scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {step.icon}
          </motion.span>
          <span className="text-3xl font-extrabold text-yellow-400">{step.number}</span>
        </div>
        <h2 className="heading-md mb-4 text-white font-extrabold">{step.title}</h2>
        <p className="text-white/90 text-lg mb-6 font-medium leading-relaxed">{step.description}</p>
        
        <div className="space-y-3">
          {step.details.map((detail, i) => (
            <div key={i} className="flex items-start group">
              <CheckCircle2 className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-white/90 font-medium">{detail}</span>
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
