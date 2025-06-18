
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  user: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center bg-gradient-to-br from-mansablue to-mansablue-dark rounded-xl p-4 text-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-mansablue/20 to-transparent"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-mansagold/10 rounded-full -translate-y-12 translate-x-12"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-mansagold/10 rounded-full translate-y-8 -translate-x-8"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-2">
          <TrendingUp className="h-6 w-6 text-mansagold mr-2" />
          <h1 className="text-2xl font-bold">
            {user ? 'Your Community Impact' : 'Community Impact Dashboard'}
          </h1>
        </div>
        
        <p className="text-base text-blue-100 max-w-2xl mx-auto leading-relaxed mb-4">
          {user 
            ? 'See how your support of Black-owned businesses creates real wealth circulation and job opportunities in our community'
            : 'Discover the collective impact of supporting Black-owned businesses in building community wealth and economic empowerment'
          }
        </p>
        
        {/* Show different notices based on auth status */}
        {!user ? (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 inline-flex flex-col items-center gap-2 text-white max-w-sm mx-auto">
            <div className="flex items-center gap-2 text-sm font-medium">
              <LogIn className="h-4 w-4 text-mansagold" />
              <span>Sign in to track your personal impact</span>
            </div>
            <Link to="/login">
              <Button size="sm" className="bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold px-4 py-1.5 shadow-lg hover:shadow-xl transition-all duration-200">
                Sign In to Get Started
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 inline-flex items-center gap-2 text-white">
            <AlertCircle className="h-4 w-4 text-mansagold" />
            <span className="font-medium text-sm">Start shopping to see your real impact!</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HeroSection;
