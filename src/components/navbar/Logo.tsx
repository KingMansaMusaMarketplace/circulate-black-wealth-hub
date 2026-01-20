import React from 'react';
import { Link } from 'react-router-dom';
import mansaMusaLogo from '@/assets/mansa-musa-logo.png';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-mansagold/30 shadow-md bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-mansagold/50 group-hover:shadow-lg">
        <img 
          src={mansaMusaLogo} 
          alt="1325.ai" 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xl font-bold text-mansagold transition-colors duration-300">1325.ai</span>
    </Link>
  );
};

export default Logo;
