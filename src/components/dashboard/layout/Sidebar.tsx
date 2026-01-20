
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import SidebarNavigation from './SidebarNavigation';
import UserProfileSection from './UserProfileSection';
import { User } from '@supabase/supabase-js';

interface SidebarProps {
  user: User | null;
  mobileNavOpen: boolean;
  setMobileNavOpen?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, mobileNavOpen, setMobileNavOpen }) => {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-20 transform glass-card w-72 md:w-80 lg:w-64 transition-all duration-300 ease-out",
      mobileNavOpen ? "translate-x-0" : "-translate-x-full",
      "lg:translate-x-0 lg:static lg:z-0",
      "safe-left safe-top safe-bottom"
    )}>
      <div className="h-full flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border/50">
          <Link 
            to="/" 
            className="text-2xl font-display font-bold text-primary flex items-center touch-manipulation"
            onClick={() => setMobileNavOpen?.(false)}
          >
            1325.ai
          </Link>
        </div>
        
        {/* Navigation */}
        <div onClick={() => setMobileNavOpen?.(false)}>
          <SidebarNavigation />
        </div>
        
        {/* User info */}
        <UserProfileSection user={user} />
      </div>
    </aside>
  );
};

export default Sidebar;
