import React from 'react';
import { Link } from 'react-router-dom';
import logo1325 from '@/assets/1325-ai-logo.png';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <img 
        src={logo1325} 
        alt="1325.AI" 
        className="h-14 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
      />
    </Link>
  );
};

export default Logo;
