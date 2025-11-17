
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface InfoCardProps {
  number: string;
  title: string;
  description: string;
  isVisible: boolean;
  delay: number;
}

const InfoCard = ({ number, title, description, isVisible, delay }: InfoCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        delay 
      }
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md">
          {number}
        </div>
        <ArrowRight className="ml-3 text-amber-500" size={20} />
      </div>
      <h3 className="font-bold text-xl mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{title}</h3>
      <p className="text-gray-700 font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default InfoCard;
