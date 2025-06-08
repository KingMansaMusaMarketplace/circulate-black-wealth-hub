
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLinks: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link 
        to="/" 
        className={`text-sm font-medium transition-colors hover:text-mansagold ${
          isActive('/') ? 'text-mansagold' : 'text-gray-700'
        }`}
      >
        Home
      </Link>
      <Link 
        to="/about" 
        className={`text-sm font-medium transition-colors hover:text-mansagold ${
          isActive('/about') ? 'text-mansagold' : 'text-gray-700'
        }`}
      >
        About
      </Link>
      <Link 
        to="/how-it-works" 
        className={`text-sm font-medium transition-colors hover:text-mansagold ${
          isActive('/how-it-works') ? 'text-mansagold' : 'text-gray-700'
        }`}
      >
        How It Works
      </Link>
      <Link 
        to="/directory/enhanced" 
        className={`text-sm font-medium transition-colors hover:text-mansagold ${
          isActive('/directory/enhanced') || isActive('/directory') ? 'text-mansagold' : 'text-gray-700'
        }`}
      >
        Directory
      </Link>
      <Link 
        to="/community" 
        className={`text-sm font-medium transition-colors hover:text-mansagold ${
          isActive('/community') ? 'text-mansagold' : 'text-gray-700'
        }`}
      >
        Community
      </Link>
      <Link 
        to="/subscription" 
        className={`text-sm font-medium transition-colors hover:text-mansagold ${
          isActive('/subscription') ? 'text-mansagold' : 'text-gray-700'
        }`}
      >
        Plans
      </Link>
      <Link 
        to="/sponsorship" 
        className={`text-sm font-medium transition-colors hover:text-mansagold ${
          isActive('/sponsorship') ? 'text-mansagold' : 'text-gray-700'
        }`}
      >
        Sponsorship
      </Link>
      <Link 
        to="/contact" 
        className={`text-sm font-medium transition-colors hover:text-mansagold ${
          isActive('/contact') ? 'text-mansagold' : 'text-gray-700'
        }`}
      >
        Contact
      </Link>
    </div>
  );
};

export default NavLinks;
