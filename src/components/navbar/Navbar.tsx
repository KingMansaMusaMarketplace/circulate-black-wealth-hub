
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`bg-white shadow-sm z-40 w-full sticky top-0 border-b border-gray-100 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between py-3">
          <div className="flex items-center">
            {/* Logo */}
            <Logo />
            
            {/* Navigation links - only show on desktop */}
            <NavLinks className="ml-10" />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            )}

            {/* User menu (auth buttons or user avatar) */}
            <UserMenu 
              user={user} 
              signOut={signOut} 
              isLoginPage={isLoginPage} 
              isSignupPage={isSignupPage}
              isMobile={isMobile}
            />
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMobile && (
          <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        )}
      </div>
    </header>
  );
};

export default Navbar;
