
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img 
        src="/placeholder.svg" 
        alt="Mansa Musa" 
        className="w-8 h-8 rounded-full object-cover"
      />
      <span className="text-xl font-bold text-mansablue">Mansa Musa Marketplace</span>
    </Link>
  );
};

export default Logo;
