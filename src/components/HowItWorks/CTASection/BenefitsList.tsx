
import React from 'react';
import { motion, AnimationControls } from 'framer-motion';
import { Users, Star, CircleDollarSign } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BenefitsListProps {
  isVisible: boolean;
  controls: AnimationControls;
}

export const BenefitsList: React.FC<BenefitsListProps> = ({ isVisible, controls }) => {
  const benefits = [
    {
      icon: <Users className="h-5 w-5" />,
      text: "Help us reach 1M members",
      tooltip: "Be part of building the Black economic movement"
    },
    {
      icon: <Star className="h-5 w-5" />,
      text: "Access exclusive deals",
      tooltip: "Save 10-20% at every participating business"
    },
    {
      icon: <CircleDollarSign className="h-5 w-5" />,
      text: "Earn loyalty points",
      tooltip: "Redeem points for real rewards and discounts"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="flex justify-center flex-wrap gap-4 mb-8 relative"
    >
      {/* Decorative line connecting benefits */}
      <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-white/10 -z-10 hidden md:block"></div>
      
      <TooltipProvider>
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full cursor-pointer transition-all border border-white/5 backdrop-blur-sm"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <span className="mr-2 text-mansagold">{benefit.icon}</span>
                  <span className="text-sm md:text-base">{benefit.text}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-mansagold text-white border-none">
                <p>{benefit.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        ))}
      </TooltipProvider>
    </motion.div>
  );
};
