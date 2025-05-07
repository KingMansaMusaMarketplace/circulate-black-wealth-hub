
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

const InfoCard = ({ number, title, description, isVisible, delay }: InfoCardProps) => (
  <motion.div
    className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
    initial={{ opacity: 0, y: 20 }}
    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    transition={{ duration: 0.6, delay }}
  >
    <div className="flex items-center mb-4">
      <div className="bg-mansablue/10 text-mansablue font-bold rounded-full w-8 h-8 flex items-center justify-center">
        {number}
      </div>
      <ArrowRight className="ml-3 text-mansagold" size={16} />
    </div>
    <h3 className="font-bold text-lg text-mansablue mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default InfoCard;
