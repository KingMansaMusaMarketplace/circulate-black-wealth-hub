
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, MapPin } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if the link matches the current route
  const isActive = (path: string) => {
    return location.pathname === path ? "text-mansablue font-bold" : "text-gray-600 hover:text-mansablue";
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-mansablue flex items-center justify-center">
            <span className="text-white font-spartan font-bold text-xl">M</span>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-spartan font-bold text-lg text-mansablue leading-none">Mansa Musa</span>
            <span className="text-xs text-mansablue-dark">Marketplace</span>
          </div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            <Link to="/about" className={`font-medium transition-colors duration-200 ${isActive('/about')}`}>
              About
            </Link>
            <Link to="/directory" className={`font-medium transition-colors duration-200 flex items-center ${isActive('/directory')}`}>
              <MapPin size={16} className="mr-1 text-mansablue" />
              Directory
            </Link>
            <Link to="/how-it-works" className={`font-medium transition-colors duration-200 ${isActive('/how-it-works')}`}>
              How It Works
            </Link>
            <Link to="/team-contact" className={`font-medium transition-colors duration-200 ${isActive('/team-contact')}`}>
              Our Team
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="font-medium">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-mansablue hover:bg-mansablue-dark font-medium">Get Started</Button>
            </Link>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container-custom flex flex-col space-y-4">
            <Link 
              to="/about" 
              className={`font-medium py-2 transition-colors duration-200 ${isActive('/about')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/directory" 
              className={`font-medium py-2 transition-colors duration-200 flex items-center ${isActive('/directory')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin size={16} className="mr-1 text-mansablue" />
              Directory
            </Link>
            <Link 
              to="/how-it-works" 
              className={`font-medium py-2 transition-colors duration-200 ${isActive('/how-it-works')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/team-contact" 
              className={`font-medium py-2 transition-colors duration-200 ${isActive('/team-contact')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Our Team
            </Link>
            <div className="flex flex-col space-y-3 pt-3 border-t border-gray-100">
              <Link to="/login">
                <Button variant="outline" className="w-full font-medium" onClick={() => setIsMenuOpen(false)}>
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full bg-mansablue hover:bg-mansablue-dark font-medium" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
