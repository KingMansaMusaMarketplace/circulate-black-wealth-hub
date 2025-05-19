
import React from 'react';
import { Gamepad } from 'lucide-react';

const GamificationHeader = () => {
  return (
    <div className="text-center mb-12">
      <h2 className="heading-md text-mansablue mb-4">Earn While You Support</h2>
      <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
      <div className="flex justify-center items-center gap-2 mb-4">
        <Gamepad className="h-5 w-5 text-mansagold" />
        <p className="text-lg font-medium text-mansablue-dark">Making Economic Empowerment Fun</p>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Discover how our gamified platform rewards you for supporting Black-owned businesses 
        and participating in economic circulation.
      </p>
    </div>
  );
};

export default GamificationHeader;
