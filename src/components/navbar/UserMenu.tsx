
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { LoyaltyPointsIndicator } from '@/components/loyalty/LoyaltyPointsIndicator';

interface UserMenuProps {
  user: User | null;
  signOut: () => void;
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
      <div className="flex items-center space-x-4">
        {/* Loyalty points indicator if user is logged in */}
        <Link to="/loyalty" className="hidden md:flex">
          <LoyaltyPointsIndicator />
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url as string} alt={user?.user_metadata?.name as string} />
                <AvatarFallback>{user?.user_metadata?.name?.charAt(0).toUpperCase() || 'MM'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/business-profile'}>
              Business Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/qr-code-management'}>
              QR Code Management
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/loyalty'}>
              Loyalty Program
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  
  // Show auth buttons when user is not logged in and not on mobile
  if (!isMobile) {
    return (
      <div className="flex items-center space-x-4">
        {!isLoginPage && (
          <Link to="/login">
            <Button variant="outline">Log In</Button>
          </Link>
        )}
        {!isSignupPage && (
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        )}
      </div>
    );
  }
  
  // Return null for mobile case, since auth buttons are in the mobile menu
  return null;
};

export default UserMenu;
