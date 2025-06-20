
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  
  // Ensure React and router context are ready
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Don't render until ready - show a simple fallback
  if (!isReady) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-mansablue">
              Mansa Musa Marketplace
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-mansablue">
            Mansa Musa Marketplace
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-mansablue">
              Home
            </Link>
            <Link to="/directory" className="text-gray-700 hover:text-mansablue">
              Directory
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-mansablue">
              About
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
