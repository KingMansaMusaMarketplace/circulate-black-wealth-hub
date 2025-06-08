
import React from 'react';
import { Link } from 'react-router-dom';
import MansaMusaLogo from '@/components/brand/MansaMusaLogo';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <MansaMusaLogo variant="default" size="sm" />
      <span className="text-xl font-bold text-mansablue">Mansa Musa Marketplace</span>
    </Link>
  );
};

export default Logo;
