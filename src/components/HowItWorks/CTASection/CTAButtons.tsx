
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CTAButtonsProps {
  isVisible: boolean;
}

export const CTAButtons: React.FC<CTAButtonsProps> = ({ isVisible }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <motion.div 
      className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7, delay: 0.6 }}
    >
      {/* Decorative elements behind buttons */}
      <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-16 bg-white/5 rounded-full blur-xl hidden md:block pointer-events-none"></div>
      
      <Link to="/business-signup" style={{ touchAction: 'manipulation' }}>
        <Button 
          variant="white" 
          className="px-8 py-6 text-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{ touchAction: 'manipulation' }}
        >
          <Building2 className="mr-2 h-5 w-5 pointer-events-none" />
          <span className="pointer-events-none">Business Sign Up</span>
        </Button>
      </Link>
      
      <Link to="/signup" style={{ touchAction: 'manipulation' }}>
        <Button 
          variant="outline" 
          className="px-8 py-6 text-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 border-white/30 text-white hover:bg-white/10"
          style={{ touchAction: 'manipulation' }}
        >
          <Users className="mr-2 h-5 w-5 pointer-events-none" />
          <span className="pointer-events-none">Consumer Sign Up</span>
        </Button>
      </Link>
    </motion.div>
  );
};
