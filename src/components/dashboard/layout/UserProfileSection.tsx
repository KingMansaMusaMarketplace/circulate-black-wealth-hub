
import React from 'react';
import { User } from '@supabase/supabase-js';

interface UserProfileSectionProps {
  user: User | null;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ user }) => {
  return (
    <div className="p-4 border-t border-white/10 flex items-center">
      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-medium mr-3">
        {user?.email?.[0].toUpperCase() || "U"}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{user?.email}</p>
        <p className="text-xs text-white/50">Business Account</p>
      </div>
    </div>
  );
};

export default UserProfileSection;
