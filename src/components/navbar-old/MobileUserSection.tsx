
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

interface MobileUserSectionProps {
  user: User | null;
  signOut: (() => void) | undefined;
  onClose: () => void;
}

const MobileUserSection: React.FC<MobileUserSectionProps> = ({ user, signOut, onClose }) => {
  return (
    <div className="pt-4 pb-3 border-t border-gray-200">
      {user ? (
        <div className="space-y-2 px-4">
          <Link
            to="/profile"
            className="block text-base font-medium text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            My Profile
          </Link>
          <Button 
            variant="outline" 
            onClick={() => {
              signOut?.();
              onClose();
            }}
            className="w-full"
          >
            Sign out
          </Button>
        </div>
      ) : (
        <div className="space-y-2 px-4">
          <Link to="/login" onClick={onClose}>
            <Button variant="outline" className="w-full">Log in</Button>
          </Link>
          <Link to="/signup" onClick={onClose}>
            <Button className="w-full">Sign up</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileUserSection;
