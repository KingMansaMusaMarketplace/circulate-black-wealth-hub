
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MansaMusaLogo from '@/components/brand/MansaMusaLogo';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';

const Navbar = () => {
  const { user, signOut, userType } = useAuth();
  const { subscriptionInfo, openCustomerPortal } = useSubscription();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
    toast.success('Signed out successfully');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <MansaMusaLogo className="h-8 w-auto" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-mansablue px-3 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/directory" className="text-gray-700 hover:text-mansablue px-3 py-2 text-sm font-medium transition-colors">
              Directory
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-mansablue px-3 py-2 text-sm font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-mansablue px-3 py-2 text-sm font-medium transition-colors">
              Contact
            </Link>
            <Link to="/comprehensive-test" className="text-gray-700 hover:text-mansablue px-3 py-2 text-sm font-medium transition-colors bg-blue-50 rounded-md">
              🔧 System Test
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || "User"} />
                      <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  {userType === 'business' && (
                    <DropdownMenuItem onClick={() => navigate('/subscription')}>
                      Subscription
                    </DropdownMenuItem>
                  )}
                  {userType === 'customer' && subscriptionInfo?.subscribed && (
                    <DropdownMenuItem onClick={openCustomerPortal}>
                      Manage Subscription
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-mansablue px-3 py-2 text-sm font-medium transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="text-white bg-mansablue hover:bg-mansablue-dark px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mansablue"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMobileMenuOpen ? 'block' : 'none'} md:hidden absolute top-full left-0 w-full bg-white shadow-md z-50`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="text-gray-700 hover:text-mansablue block px-3 py-2 rounded-md text-base font-medium transition-colors">
            Home
          </Link>
          <Link to="/directory" className="text-gray-700 hover:text-mansablue block px-3 py-2 rounded-md text-base font-medium transition-colors">
            Directory
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-mansablue block px-3 py-2 rounded-md text-base font-medium transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-mansablue block px-3 py-2 rounded-md text-base font-medium transition-colors">
            Contact
          </Link>
          <Link to="/comprehensive-test" className="text-gray-700 hover:text-mansablue block px-3 py-2 rounded-md text-base font-medium transition-colors bg-blue-50 rounded-md">
              🔧 System Test
            </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-mansablue block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Profile
              </Link>
              {userType === 'business' && (
                <Link to="/subscription" className="text-gray-700 hover:text-mansablue block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Subscription
                </Link>
              )}
              {userType === 'customer' && subscriptionInfo?.subscribed && (
                <button onClick={openCustomerPortal} className="text-gray-700 hover:text-mansablue block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Manage Subscription
                </button>
              )}
              <button onClick={handleSignOut} className="text-gray-700 hover:text-mansablue block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-mansablue block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="text-white bg-mansablue hover:bg-mansablue-dark block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
