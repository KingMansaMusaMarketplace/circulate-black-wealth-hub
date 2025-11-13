
import React from 'react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { BadgeDollarSign, TrendingUp, MapPin } from 'lucide-react';

interface LoginContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ children, header }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-md"
    >
      {header && (
        <motion.div variants={itemVariants} className="text-center mb-6">
          {header}
        </motion.div>
      )}

      <motion.div
        variants={itemVariants}
        className="glass-card p-6 md:p-8 rounded-lg shadow-lg"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default LoginContainer;
