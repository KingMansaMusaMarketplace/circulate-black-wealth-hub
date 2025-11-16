
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

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 to-mansagold/20 rounded-3xl blur-xl" />
        <motion.div
          variants={itemVariants}
          className="relative bg-card/95 backdrop-blur-sm border-2 border-border/40 shadow-xl rounded-3xl overflow-hidden p-6 md:p-8"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mansablue via-purple-600 to-mansagold" />
          <div className="relative pt-2">
            {children}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginContainer;
