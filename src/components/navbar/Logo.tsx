import React from 'react';
import { Link } from 'react-router-dom';
import mansaMusaLogo from '@/assets/mansa-musa-logo.png';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-3">
      <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-mansagold/30 shadow-lg bg-white/10 backdrop-blur-sm">
        <img 
          src={mansaMusaLogo} 
          alt="Mansa Musa Marketplace" 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xl font-bold text-mansablue">Mansa Musa Marketplace</span>
    </Link>
  );
};

export default Logo;
