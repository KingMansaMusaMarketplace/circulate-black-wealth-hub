
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img 
        src="/lovable-uploads/463fe82d-8622-41a8-8286-28b3ef9532a4.png" 
        alt="Mansa Musa Marketplace" 
        className="w-12 h-12 rounded-full object-cover"
      />
      <span className="text-xl font-bold text-mansablue">Mansa Musa Marketplace</span>
    </Link>
  );
};

export default Logo;
