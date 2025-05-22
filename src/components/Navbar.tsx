
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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

  // Function to determine if the current route is active
  const isActive = (path: string) => location.pathname === path;

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
            <nav className="hidden md:ml-8 md:flex md:space-x-2">
              <Button 
                variant={isActive('/') ? "default" : "ghost"} 
                size="sm" 
                className={isActive('/') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
                asChild
              >
                <Link to="/">Home</Link>
              </Button>
              
              <Button 
                variant={isActive('/directory') ? "default" : "ghost"} 
                size="sm" 
                className={isActive('/directory') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
                asChild
              >
                <Link to="/directory">Businesses</Link>
              </Button>
              
              <Button 
                variant={isActive('/loyalty') ? "default" : "ghost"} 
                size="sm" 
                className={isActive('/loyalty') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
                asChild
              >
                <Link to="/loyalty">Loyalty</Link>
              </Button>
              
              <Button 
                variant={isActive('/how-it-works') ? "default" : "ghost"} 
                size="sm" 
                className={isActive('/how-it-works') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
                asChild
              >
                <Link to="/how-it-works">How It Works</Link>
              </Button>
              
              <Button 
                variant={isActive('/about') ? "default" : "ghost"} 
                size="sm" 
                className={isActive('/about') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
                asChild
              >
                <Link to="/about">About</Link>
              </Button>
              
              <Button 
                variant={isActive('/corporate-sponsorship') ? "default" : "ghost"} 
                size="sm" 
                className={isActive('/corporate-sponsorship') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
                asChild
              >
                <Link to="/corporate-sponsorship">Sponsorship</Link>
              </Button>
              
              <Button 
                variant={isActive('/sales-agent') ? "default" : "ghost"} 
                size="sm" 
                className={isActive('/sales-agent') ? "bg-mansablue" : "text-gray-700 hover:text-mansablue"} 
                asChild
              >
                <Link to="/sales-agent">Sales Program</Link>
              </Button>
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
              <Button 
                variant={isActive('/') ? "default" : "ghost"}
                size="sm"
                className="justify-start"
                asChild
              >
                <Link to="/">Home</Link>
              </Button>
              
              <Button 
                variant={isActive('/directory') ? "default" : "ghost"}
                size="sm"
                className="justify-start"
                asChild
              >
                <Link to="/directory">Businesses</Link>
              </Button>
              
              <Button 
                variant={isActive('/loyalty') ? "default" : "ghost"}
                size="sm"
                className="justify-start"
                asChild
              >
                <Link to="/loyalty">Loyalty</Link>
              </Button>
              
              <Button 
                variant={isActive('/how-it-works') ? "default" : "ghost"}
                size="sm"
                className="justify-start"
                asChild
              >
                <Link to="/how-it-works">How It Works</Link>
              </Button>
              
              <Button 
                variant={isActive('/about') ? "default" : "ghost"}
                size="sm"
                className="justify-start"
                asChild
              >
                <Link to="/about">About</Link>
              </Button>
              
              <Button 
                variant={isActive('/corporate-sponsorship') ? "default" : "ghost"}
                size="sm"
                className="justify-start"
                asChild
              >
                <Link to="/corporate-sponsorship">Sponsorship</Link>
              </Button>
              
              <Button 
                variant={isActive('/sales-agent') ? "default" : "ghost"}
                size="sm"
                className="justify-start"
                asChild
              >
                <Link to="/sales-agent">Sales Program</Link>
              </Button>
              
              {!user && (
                <>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    asChild
                  >
                    <Link to="/login">Log In</Link>
                  </Button>
                  
                  <Button 
                    variant="default"
                    size="sm"
                    className="justify-start"
                    asChild
                  >
                    <Link to="/signup">Sign Up</Link>
                  </Button>
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
