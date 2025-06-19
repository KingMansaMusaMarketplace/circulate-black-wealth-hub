
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-mansagold/30 shadow-md bg-white/10 backdrop-blur-sm">
        <img 
          src="/lovable-uploads/cf76d32c-f277-43a6-96b6-58dc29f4f21f.png" 
          alt="Mansa Musa Marketplace" 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xl font-bold text-mansablue">Mansa Musa Marketplace</span>
    </Link>
  );
};

export default Logo;
