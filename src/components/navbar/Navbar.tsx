
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`bg-white shadow-sm z-50 w-full sticky top-0 border-b border-gray-100 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Logo />
              {!isMobile && (
                <div className="ml-12">
                  <NavLinks />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMobileMenu} 
                  className="md:hidden relative z-50"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              )}

              <UserMenu user={user} />
            </div>
          </div>
        </div>

        {/* Mobile navigation overlay */}
        {isMobile && mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={closeMobileMenu} />
        )}
      </header>

      {/* Mobile navigation menu */}
      {isMobile && (
        <MobileMenu onNavigate={closeMobileMenu} />
      )}
    </>
  );
};

export default Navbar;
