
import React from 'react';
import { Gamepad } from 'lucide-react';

const GamificationHeader = () => {
  return (
    <div className="text-center mb-12">
      <h2 className="heading-md mb-4">
        <span className="bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-md">Earn While </span>
        <span className="bg-gradient-to-r from-mansablue via-blue-600 to-blue-700 bg-clip-text text-transparent drop-shadow-md">You Support</span>
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 mx-auto mb-6 rounded-full shadow-lg shadow-mansagold/40"></div>
      <div className="flex justify-center items-center gap-3 mb-4">
        <Gamepad className="h-7 w-7 text-mansagold animate-pulse drop-shadow-lg" />
        <p className="text-xl font-bold bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-md">
          Making Economic Empowerment Fun
        </p>
      </div>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
        Discover how our gamified platform rewards you for supporting Black-owned businesses 
        and participating in economic circulation.
      </p>
    </div>
  );
};

export default GamificationHeader;
