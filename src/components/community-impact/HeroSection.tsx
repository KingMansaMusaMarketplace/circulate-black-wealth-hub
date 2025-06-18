
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  user: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {user ? 'Your Community Impact' : 'Community Impact Dashboard'}
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        {user 
          ? 'See how your support of Black-owned businesses creates real wealth circulation and job opportunities in our community'
          : 'Discover the collective impact of supporting Black-owned businesses in building community wealth'
        }
      </p>
      
      {/* Show different notices based on auth status */}
      {!user ? (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-flex flex-col items-center gap-3 text-blue-700">
          <div className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span className="text-sm">Sign in to track your personal impact</span>
          </div>
          <Link to="/login">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign In to Get Started
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg inline-flex items-center gap-2 text-blue-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          Start shopping to see your real impact!
        </div>
      )}
    </motion.div>
  );
};

export default HeroSection;
