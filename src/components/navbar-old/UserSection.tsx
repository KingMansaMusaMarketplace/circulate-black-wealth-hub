
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

interface UserSectionProps {
  user: User | null;
  signOut: (() => void) | undefined;
}

const UserSection: React.FC<UserSectionProps> = ({ user, signOut }) => {
  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="text-gray-500 hover:text-gray-700">
          My Profile
        </Link>
        <Button variant="outline" onClick={() => signOut?.()}>
          Sign out
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-4">
      <Link to="/login">
        <Button variant="outline">Log in</Button>
      </Link>
      <Link to="/signup">
        <Button>Sign up</Button>
      </Link>
    </div>
  );
};

export default UserSection;
