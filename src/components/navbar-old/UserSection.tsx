
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
      <Button variant="outline" asChild>
        <Link to="/login">Log in</Link>
      </Button>
      <Button asChild>
        <Link to="/signup">Sign up</Link>
      </Button>
    </div>
  );
};

export default UserSection;
