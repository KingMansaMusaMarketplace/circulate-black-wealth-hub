
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NavLinksProps {
  className?: string;
}

const NavLinks: React.FC<NavLinksProps> = ({ className = "" }) => {
  const location = useLocation();
  
  // Function to determine if the current route is active
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className={`hidden md:flex md:space-x-2 ${className}`}>
      <Button 
        variant={isActive('/') ? "default" : "ghost"} 
        size="sm" 
        className={isActive('/') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
        asChild
      >
        <Link to="/">Home</Link>
      </Button>
      
      <Button 
        variant={isActive('/directory') ? "default" : "ghost"} 
        size="sm" 
        className={isActive('/directory') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
        asChild
      >
        <Link to="/directory">Directory</Link>
      </Button>
      
      <Button 
        variant={isActive('/businesses') ? "default" : "ghost"} 
        size="sm" 
        className={isActive('/businesses') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
        asChild
      >
        <Link to="/businesses">Businesses</Link>
      </Button>
      
      <Button 
        variant={isActive('/loyalty') ? "default" : "ghost"} 
        size="sm" 
        className={isActive('/loyalty') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
        asChild
      >
        <Link to="/loyalty">Loyalty</Link>
      </Button>
      
      <Button 
        variant={isActive('/how-it-works') ? "default" : "ghost"} 
        size="sm" 
        className={isActive('/how-it-works') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
        asChild
      >
        <Link to="/how-it-works">How It Works</Link>
      </Button>
      
      <Button 
        variant={isActive('/about') ? "default" : "ghost"} 
        size="sm" 
        className={isActive('/about') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
        asChild
      >
        <Link to="/about">About</Link>
      </Button>
      
      <Button 
        variant={isActive('/about-us') ? "default" : "ghost"} 
        size="sm" 
        className={isActive('/about-us') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
        asChild
      >
        <Link to="/about-us">About Us</Link>
      </Button>
      
      <Button 
        variant={isActive('/team-contact') ? "default" : "ghost"} 
        size="sm" 
        className={isActive('/team-contact') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
        asChild
      >
        <Link to="/team-contact">Our Team</Link>
      </Button>
      
      <Button 
        variant={isActive('/corporate-sponsorship') ? "default" : "ghost"} 
        size="sm" 
        className={isActive('/corporate-sponsorship') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
        asChild
      >
        <Link to="/corporate-sponsorship">Sponsorship</Link>
      </Button>
      
      <Button 
        variant={isActive('/sales-agent') ? "default" : "ghost"} 
        size="sm" 
        className={isActive('/sales-agent') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
        asChild
      >
        <Link to="/sales-agent">Sales Program</Link>
      </Button>
    </nav>
  );
};

export default NavLinks;
