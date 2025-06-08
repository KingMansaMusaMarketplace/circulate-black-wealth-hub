
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut, Dashboard } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface UserMenuProps {
  user: SupabaseUser | null;
  signOut: () => Promise<void>;
  isLoginPage: boolean;
  isSignupPage: boolean;
  isMobile: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ 
  user, 
  signOut, 
  isLoginPage, 
  isSignupPage, 
  isMobile 
}) => {
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center">
              <Dashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/subscription" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'flex-col w-full' : ''}`}>
      {!isLoginPage && (
        <Button variant="ghost" asChild className={isMobile ? 'w-full' : ''}>
          <Link to="/login">Sign In</Link>
        </Button>
      )}
      {!isSignupPage && (
        <Button asChild className={`bg-mansablue hover:bg-mansablue/90 ${isMobile ? 'w-full' : ''}`}>
          <Link to="/signup">Get Started</Link>
        </Button>
      )}
    </div>
  );
};

export default UserMenu;
