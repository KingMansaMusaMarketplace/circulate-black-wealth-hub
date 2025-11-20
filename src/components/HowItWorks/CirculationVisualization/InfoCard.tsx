
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
      className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-2 border-white/20 hover:border-blue-400/50"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md">
          {number}
        </div>
        <ArrowRight className="ml-3 text-yellow-400" size={20} />
      </div>
      <h3 className="font-bold text-xl mb-2 text-blue-300">{title}</h3>
      <p className="text-white/90 font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default InfoCard;
