
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import MobileNavLinks from './MobileNavLinks';
import MobileUserSection from './MobileUserSection';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  signOut: (() => void) | undefined;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, user, signOut }) => {
  if (!isOpen) return null;
  
  return (
    <div className="sm:hidden">
      {/* Mobile Navigation Links */}
      <MobileNavLinks user={user} onClose={onClose} />
      
      {/* Mobile User Section */}
      <MobileUserSection user={user} signOut={signOut} onClose={onClose} />
    </div>
  );
};

export default MobileMenu;
