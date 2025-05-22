
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoyaltyPointsIndicator } from './loyalty/LoyaltyPointsIndicator';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';

  return (
    <header className={`bg-white shadow-sm z-40 w-full ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="Mansa Musa Marketplace Logo" className="h-8 mr-2" />
              <span className="font-semibold text-lg text-mansablue">Mansa Musa</span>
            </Link>
            
            {/* Navigation links - only show on desktop */}
            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              <Link to="/" className="text-gray-700 hover:text-mansablue transition-colors">
                Home
              </Link>
              <Link to="/directory" className="text-gray-700 hover:text-mansablue transition-colors">
                Businesses
              </Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-mansablue transition-colors">
                How It Works
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-mansablue transition-colors">
                About
              </Link>
              <Link to="/corporate-sponsorship" className="text-gray-700 hover:text-mansablue transition-colors">
                Sponsorship
              </Link>
              <Link to="/sales-agent" className="text-gray-700 hover:text-mansablue transition-colors">
                Sales Program
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            )}

            {/* Add the loyalty points indicator if the user is logged in */}
            {user && (
              <Link to="/loyalty" className="hidden md:flex">
                <LoyaltyPointsIndicator />
              </Link>
            )}
            
            {/* Auth buttons or user avatar */}
            {user ? (
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
            ) : (
              <>
                {!isLoginPage && !isMobile && (
                  <Link to="/login">
                    <Button variant="outline">Log In</Button>
                  </Link>
                )}
                {!isSignupPage && !isMobile && (
                  <Link to="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMobile && mobileMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 pb-2">
              <Link to="/" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Home
              </Link>
              <Link to="/directory" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Businesses
              </Link>
              <Link to="/how-it-works" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                How It Works
              </Link>
              <Link to="/about" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                About
              </Link>
              <Link to="/corporate-sponsorship" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Sponsorship
              </Link>
              <Link to="/sales-agent" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Sales Program
              </Link>
              {!user && (
                <>
                  <Link to="/login" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    Log In
                  </Link>
                  <Link to="/signup" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
