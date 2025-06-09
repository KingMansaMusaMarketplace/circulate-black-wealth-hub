
import React, { useState, useEffect } from 'react';
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

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // Close mobile menu when scrolling
  useEffect(() => {
    if (!isMobile || !mobileMenuOpen) return;

    const handleScroll = () => {
      closeMobileMenu();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-mobile-menu]') && !target.closest('[data-mobile-menu-trigger]')) {
        closeMobileMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`bg-white shadow-sm z-50 w-full sticky top-0 border-b border-gray-100 ${className}`}>
        <div className="w-full px-4 max-w-none overflow-x-hidden">
          <div className="flex h-16 items-center justify-between w-full">
            <div className="flex items-center min-w-0 flex-shrink-0">
              <Logo />
              {!isMobile && (
                <div className="ml-12 hidden md:block">
                  <NavLinks />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMobileMenu} 
                  className="md:hidden relative z-50"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  data-mobile-menu-trigger
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
      </header>

      {/* Mobile navigation menu */}
      {isMobile && mobileMenuOpen && (
        <MobileMenu onNavigate={closeMobileMenu} />
      )}
    </>
  );
};

export default Navbar;
