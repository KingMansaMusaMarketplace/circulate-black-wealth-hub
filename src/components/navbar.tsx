
import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-mansablue">
            Mansa Musa Marketplace
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-mansablue">
              Home
            </Link>
            <Link to="/directory" className="text-gray-600 hover:text-mansablue">
              Directory
            </Link>
            <Link to="/login" className="bg-mansablue text-white px-4 py-2 rounded hover:bg-mansablue/90">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
