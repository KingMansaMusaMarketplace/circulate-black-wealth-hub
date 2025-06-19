
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NavLinks: React.FC = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link 
        to="/" 
        className="text-gray-600 hover:text-mansablue transition-colors touch-manipulation"
      >
        Home
      </Link>
      <Link 
        to="/directory" 
        className="text-gray-600 hover:text-mansablue transition-colors touch-manipulation"
      >
        Directory
      </Link>
      <Link 
        to="/education" 
        className="text-gray-600 hover:text-mansablue transition-colors touch-manipulation"
      >
        Education
      </Link>
      <Link 
        to="/scanner" 
        className="text-gray-600 hover:text-mansablue transition-colors touch-manipulation"
      >
        QR Scanner
      </Link>
      <Link 
        to="/loyalty" 
        className="text-gray-600 hover:text-mansablue transition-colors touch-manipulation"
      >
        Rewards
      </Link>
      <Link 
        to="/community-impact" 
        className="text-gray-600 hover:text-mansablue transition-colors touch-manipulation"
      >
        Impact
      </Link>
      <Link 
        to="/corporate-sponsorship" 
        className="text-gray-600 hover:text-mansablue transition-colors touch-manipulation"
      >
        Sponsors
      </Link>
      
      {/* Add mobile readiness test link for easy access */}
      <Link to="/mobile-readiness-test">
        <Button variant="outline" size="sm" className="text-xs touch-manipulation">
          📱 Mobile Test
        </Button>
      </Link>
    </nav>
  );
};

export default NavLinks;
