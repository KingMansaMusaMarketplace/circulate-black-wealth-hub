
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-mansablue rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">M</span>
      </div>
      <span className="text-xl font-bold text-mansablue">Mansa</span>
    </Link>
  );
};

export default Logo;
