
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NavLinks: React.FC = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link to="/" className="text-gray-600 hover:text-mansablue transition-colors">
        Home
      </Link>
      <Link to="/directory" className="text-gray-600 hover:text-mansablue transition-colors">
        Directory
      </Link>
      <Link to="/scanner" className="text-gray-600 hover:text-mansablue transition-colors">
        QR Scanner
      </Link>
      <Link to="/loyalty" className="text-gray-600 hover:text-mansablue transition-colors">
        Rewards
      </Link>
      <Link to="/community-impact" className="text-gray-600 hover:text-mansablue transition-colors">
        Impact
      </Link>
      <Link to="/corporate-sponsorship" className="text-gray-600 hover:text-mansablue transition-colors">
        Sponsors
      </Link>
      
      {/* Add mobile readiness test link for easy access */}
      <Link to="/mobile-readiness-test">
        <Button variant="outline" size="sm" className="text-xs">
          📱 Mobile Test
        </Button>
      </Link>
    </nav>
  );
};

export default NavLinks;
