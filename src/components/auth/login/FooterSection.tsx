
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export const FooterSection: React.FC = () => {
  return (
    <>
      <Separator className="my-4" />
      
      <motion.div 
        className="text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-mansablue hover:text-mansagold transition-colors font-medium"
          >
            Sign up
          </Link>
        </p>
        
        <p className="text-xs text-gray-500">
          By signing in, you're joining a movement to circulate wealth in the Black community.
        </p>
      </motion.div>
    </>
  );
};
