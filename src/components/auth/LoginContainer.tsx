
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

      <div className="relative group">
        {/* Animated glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-mansablue via-blue-600 to-mansagold rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse" />
        
        {/* Secondary subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-mansagold/20 via-transparent to-mansablue/20 rounded-3xl blur-2xl" />
        
        <motion.div
          variants={itemVariants}
          className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden p-6 md:p-8"
        >
          {/* Top accent bar with shimmer effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mansablue via-mansagold to-mansablue bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
          
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mansagold/20 to-transparent rounded-bl-full" />
          <div className="relative pt-4">
            {children}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginContainer;
