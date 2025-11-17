
import React from 'react';
import { Gamepad } from 'lucide-react';

const GamificationHeader = () => {
  return (
    <div className="text-center mb-12">
      <h2 className="heading-md mb-4">
        <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">Earn While </span>
        <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">You Support</span>
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
      <div className="flex justify-center items-center gap-3 mb-4">
        <Gamepad className="h-7 w-7 text-pink-600 animate-pulse" />
        <p className="text-xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent">
          Making Economic Empowerment Fun
        </p>
      </div>
      <p className="text-lg bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent max-w-2xl mx-auto font-medium">
        Discover how our gamified platform rewards you for supporting Black-owned businesses 
        and participating in economic circulation.
      </p>
    </div>
  );
};

export default GamificationHeader;
