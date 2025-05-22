
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  // Function to determine if the current route is active
  const isActive = (path: string) => location.pathname === path;

  if (!isOpen) return null;
  
  return (
    <>
      <div className="md:hidden py-2 border-t border-gray-200">
        <nav className="flex flex-col space-y-2 pb-2">
          <Button 
            variant={isActive('/') ? "default" : "ghost"}
            size="sm"
            className="justify-start"
            asChild
          >
            <Link to="/" onClick={onClose}>Home</Link>
          </Button>
          
          <Button 
            variant={isActive('/directory') ? "default" : "ghost"}
            size="sm"
            className="justify-start"
            asChild
          >
            <Link to="/directory" onClick={onClose}>Directory</Link>
          </Button>
          
          <Button 
            variant={isActive('/businesses') ? "default" : "ghost"}
            size="sm"
            className="justify-start"
            asChild
          >
            <Link to="/directory" onClick={onClose}>Businesses</Link>
          </Button>
          
          <Button 
            variant={isActive('/loyalty') ? "default" : "ghost"}
            size="sm"
            className="justify-start"
            asChild
          >
            <Link to="/loyalty" onClick={onClose}>Loyalty</Link>
          </Button>
          
          <Button 
            variant={isActive('/how-it-works') ? "default" : "ghost"}
            size="sm"
            className="justify-start"
            asChild
          >
            <Link to="/how-it-works" onClick={onClose}>How It Works</Link>
          </Button>
          
          <Button 
            variant={isActive('/about') ? "default" : "ghost"}
            size="sm"
            className="justify-start"
            asChild
          >
            <Link to="/about" onClick={onClose}>About</Link>
          </Button>
          
          <Button 
            variant={isActive('/corporate-sponsorship') ? "default" : "ghost"}
            size="sm"
            className="justify-start"
            asChild
          >
            <Link to="/corporate-sponsorship" onClick={onClose}>Sponsorship</Link>
          </Button>
          
          <Button 
            variant={isActive('/sales-agent') ? "default" : "ghost"}
            size="sm"
            className="justify-start"
            asChild
          >
            <Link to="/sales-agent" onClick={onClose}>Sales Program</Link>
          </Button>
          
          <div className="pt-2 border-t border-gray-100">
            <Button 
              variant="outline"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link to="/login" onClick={onClose}>Log In</Link>
            </Button>
            
            <Button 
              variant="default"
              size="sm"
              className="w-full justify-start mt-2"
              asChild
            >
              <Link to="/signup" onClick={onClose}>Sign Up</Link>
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Mobile nav backdrop */}
      <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-50 z-10 lg:hidden"
        onClick={onClose}
      />
    </>
  );
};

export default MobileMenu;
