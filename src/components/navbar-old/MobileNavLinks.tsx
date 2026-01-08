
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

interface MobileNavLinksProps {
  user: User | null;
  onClose: () => void;
}

const MobileNavLinks: React.FC<MobileNavLinksProps> = ({ user, onClose }) => {
  return (
    <div className="pt-2 pb-3 space-y-1">
      <Link
        to="/"
        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
        onClick={onClose}
      >
        Home
      </Link>
      <Link
        to="/directory"
        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
        onClick={onClose}
      >
        Businesses
      </Link>
      {user && user.user_metadata?.role === 'customer' && (
        <>
          <Link
            to="/loyalty"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={onClose}
          >
            My Rewards
          </Link>
          <Link
            to="/scanner"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={onClose}
          >
            Scan QR
          </Link>
        </>
      )}
      {user && user.user_metadata?.role === 'business' && (
        <>
          <Link
            to="/business-dashboard"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={onClose}
          >
            Dashboard
          </Link>
          <Link
            to="/qr-generator"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={onClose}
          >
            QR Codes
          </Link>
        </>
      )}
      {user && user.user_metadata?.is_agent && (
        <Link
          to="/agent-dashboard"
          className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
          onClick={onClose}
        >
          Agent Dashboard
        </Link>
      )}
      <Link
        to="/referrals"
        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
        onClick={onClose}
      >
        Referrals
      </Link>
    </div>
  );
};

export default MobileNavLinks;
