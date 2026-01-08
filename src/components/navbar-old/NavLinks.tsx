
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

interface NavLinksProps {
  user: User | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ user }) => {
  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
        Home
      </Link>
      <Link to="/directory" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
        Businesses
      </Link>
      {user && user.user_metadata?.role === 'customer' && (
        <>
          <Link to="/loyalty" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            My Rewards
          </Link>
          <Link to="/scanner" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Scan QR
          </Link>
        </>
      )}
      {user && user.user_metadata?.role === 'business' && (
        <>
          <Link to="/business-dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            Dashboard
          </Link>
          <Link to="/qr-generator" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
            QR Codes
          </Link>
        </>
      )}
      {user && user.user_metadata?.is_agent && (
        <Link to="/agent-dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
          Agent Dashboard
        </Link>
      )}
      <Link to="/referrals" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
        Referrals
      </Link>
    </div>
  );
};

export default NavLinks;
