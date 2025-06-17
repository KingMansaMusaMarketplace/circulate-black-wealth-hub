
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, DollarSign, Heart } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, delay }) => {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.div 
      className="text-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
    >
      <div className="flex justify-center mb-2 text-mansagold">
        {icon}
      </div>
      <div className="text-2xl font-bold text-mansablue">
        {displayValue}
      </div>
      <div className="text-sm text-gray-600">
        {label}
      </div>
    </motion.div>
  );
};

const CommunityStatsWidget: React.FC = () => {
  const stats = [
    {
      icon: <Users size={24} />,
      value: '12,847',
      label: 'Community Members',
      delay: 500
    },
    {
      icon: <Building2 size={24} />,
      value: '3,200+',
      label: 'Black-Owned Businesses',
      delay: 700
    },
    {
      icon: <DollarSign size={24} />,
      value: '$2.8M',
      label: 'Money Circulated',
      delay: 900
    },
    {
      icon: <Heart size={24} />,
      value: '98%',
      label: 'Satisfaction Rate',
      delay: 1100
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-white">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-mansablue mb-2">
            Our Community Impact
          </h2>
          <p className="text-gray-600">
            Together we're building a stronger economic foundation
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityStatsWidget;
