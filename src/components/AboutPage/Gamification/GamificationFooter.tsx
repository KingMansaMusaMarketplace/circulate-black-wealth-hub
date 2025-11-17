
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const GamificationFooter = () => {
  return (
    <div className="mt-12 text-center">
      <Link to="/signup">
        <Button size="lg" className="bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 hover:from-amber-600 hover:via-yellow-600 hover:to-yellow-700 text-white px-12 py-7 text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 rounded-xl">
          Start Earning Rewards
        </Button>
      </Link>
      <p className="text-gray-700 font-medium mt-6 bg-white/60 backdrop-blur-sm inline-block px-6 py-3 rounded-full border border-pink-200">
        🎮 Join the movement and get rewarded for supporting Black-owned businesses
      </p>
    </div>
  );
};

export default GamificationFooter;
