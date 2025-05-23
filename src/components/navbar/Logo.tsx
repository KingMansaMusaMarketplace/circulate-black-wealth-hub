
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <Link to="/" className={`flex items-center group ${className}`}>
      <img 
        src="/lovable-uploads/30f608bd-596a-4257-8272-19ad1bd552f7.png" 
        alt="Mansa Musa Marketplace Logo" 
        className="h-12 w-12 mr-3 rounded-full object-cover border-2 border-mansagold transition-transform group-hover:scale-105 duration-200" 
      />
      <div className="flex flex-col">
        <span className="font-bold text-lg text-mansablue leading-tight">Mansa Musa</span>
        <span className="text-xs text-gray-600 font-medium -mt-0.5">Marketplace</span>
      </div>
    </Link>
  );
};

export default Logo;
