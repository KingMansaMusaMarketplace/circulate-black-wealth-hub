
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

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

  const getDropdownTriggerClass = () => {
    return "text-gray-700 hover:text-mansablue px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1";
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link to="/" className={getLinkClass('/')}>
        Home
      </Link>
      
      <Link to="/about" className={getLinkClass('/about')}>
        About
      </Link>

      {/* For Businesses Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className={getDropdownTriggerClass()}>
          For Businesses
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border shadow-lg">
          <DropdownMenuItem asChild>
            <Link to="/directory" className="w-full">Business Directory</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/signup?type=business" className="w-full">Business Signup</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/sponsorship" className="w-full">Sponsorship</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/sales-agent" className="w-full">Sales Agent Program</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Resources Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className={getDropdownTriggerClass()}>
          Resources
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border shadow-lg">
          <DropdownMenuItem asChild>
            <Link to="/how-it-works" className="w-full">How It Works</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/subscription" className="w-full">Plans</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/faq" className="w-full">FAQ</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/help" className="w-full">Help Center</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/blog" className="w-full">Blog</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link to="/community" className={getLinkClass('/community')}>
        Community
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
