
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img src="/logo.svg" alt="Mansa Musa Marketplace Logo" className="h-8 mr-2" />
      <span className="font-bold text-lg text-mansablue">Mansa Musa Marketplace</span>
    </Link>
  );
};

export default Logo;
