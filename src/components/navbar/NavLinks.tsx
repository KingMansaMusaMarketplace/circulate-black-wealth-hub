
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const NavLinks = () => {
  const location = useLocation();
  const { user, userType } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string) => {
    return `text-gray-700 hover:text-mansablue px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path) ? 'text-mansablue bg-mansablue/10' : ''
    }`;
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link to="/" className={getLinkClass('/')}>
        Home
      </Link>
      <Link to="/about" className={getLinkClass('/about')}>
        About
      </Link>
      <Link to="/directory" className={getLinkClass('/directory')}>
        Directory
      </Link>
      <Link to="/how-it-works" className={getLinkClass('/how-it-works')}>
        How It Works
      </Link>
      <Link to="/subscription" className={getLinkClass('/subscription')}>
        Plans
      </Link>
      <Link to="/sales-agent" className={getLinkClass('/sales-agent')}>
        Sales Agent Program
      </Link>
      <Link to="/community" className={getLinkClass('/community')}>
        Community
      </Link>
      <Link to="/sponsorship" className={getLinkClass('/sponsorship')}>
        Sponsorship
      </Link>
      <Link to="/contact" className={getLinkClass('/contact')}>
        Contact
      </Link>
      
      {user && (
        <>
          {userType === 'business' ? (
            <>
              <Link to="/business/dashboard" className={getLinkClass('/business/dashboard')}>
                Dashboard
              </Link>
              <Link to="/business/profile" className={getLinkClass('/business/profile')}>
                Profile
              </Link>
              <Link to="/business/qr-codes" className={getLinkClass('/business/qr-codes')}>
                QR Codes
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                Dashboard
              </Link>
              <Link to="/scanner" className={getLinkClass('/scanner')}>
                Scanner
              </Link>
              <Link to="/loyalty" className={getLinkClass('/loyalty')}>
                Loyalty
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NavLinks;
