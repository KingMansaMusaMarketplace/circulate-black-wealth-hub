
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img 
        src="/lovable-uploads/20f584ba-b02b-4b47-a402-708831771379.png" 
        alt="Mansa Musa" 
        className="w-12 h-12 rounded-full object-cover"
      />
      <span className="text-xl font-bold text-mansablue">Mansa Musa Marketplace</span>
    </Link>
  );
};

export default Logo;
