import React from 'react';
import { Link } from 'react-router-dom';
import mansaMusaLogo from '@/assets/mansa-musa-logo.png';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-mansagold/30 shadow-lg bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.4] group-hover:shadow-xl">
        <img 
          src={mansaMusaLogo} 
          alt="Mansa Musa Marketplace" 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-2xl font-bold text-mansablue transition-colors group-hover:text-mansagold">Mansa Musa Marketplace</span>
    </Link>
  );
};

export default Logo;
