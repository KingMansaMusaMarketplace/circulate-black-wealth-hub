
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CTAButtonsProps {
  isVisible: boolean;
}

export const CTAButtons: React.FC<CTAButtonsProps> = ({ isVisible }) => {
  const navigate = useNavigate();

  const handleEarlyAccess = () => {
    navigate('/signup');
    toast.success("Welcome! Sign up to get early access to all features.");
  };

  return (
    <motion.div 
      className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7, delay: 0.6 }}
    >
      {/* Decorative elements behind buttons */}
      <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-16 bg-white/5 rounded-full blur-xl hidden md:block"></div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {/* Decorative glow effect */}
        <div className="absolute inset-0 bg-mansagold/20 rounded-md filter blur-md -z-10"></div>
        
        <Button onClick={handleEarlyAccess} className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg group">
          Get Early Access 
          <ArrowUp className="ml-2 rotate-45 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/directory">
          <Button variant="white" className="px-8 py-6 text-lg">
            Browse Directory
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};
