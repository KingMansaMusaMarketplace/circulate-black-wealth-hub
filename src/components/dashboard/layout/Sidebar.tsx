
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import SidebarNavigation from './SidebarNavigation';
import UserProfileSection from './UserProfileSection';
import { User } from '@supabase/supabase-js';

interface SidebarProps {
  user: User | null;
  mobileNavOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user, mobileNavOpen }) => {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-20 transform bg-white shadow-lg w-64 transition-transform duration-200 ease-in-out",
      mobileNavOpen ? "translate-x-0" : "-translate-x-full",
      "lg:translate-x-0 lg:static lg:z-0"
    )}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b">
          <Link to="/" className="text-2xl font-bold text-mansablue flex items-center">
            Mansa Musa
          </Link>
        </div>
        
        {/* Navigation */}
        <SidebarNavigation />
        
        {/* User info */}
        <UserProfileSection user={user} />
      </div>
    </aside>
  );
};

export default Sidebar;
