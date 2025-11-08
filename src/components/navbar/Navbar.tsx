
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
import NotificationBell from '@/components/notifications/NotificationBell';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu when clicking outside - improved for mobile
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-mobile-menu]') && !target.closest('[data-mobile-menu-trigger]')) {
        closeMobileMenu();
      }
    };

    // Add both click and touch events for better mobile support
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent iOS bounce scroll
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`bg-white shadow-sm z-50 w-full sticky top-0 border-b border-gray-100 ${className}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex h-24 items-center justify-between w-full">
            <div className="flex items-center min-w-0 flex-shrink-0">
              <Logo />
              {!isMobile && (
                <div className="ml-12 hidden md:block">
                  <NavLinks />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {user && !isMobile && <NotificationBell />}
              
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMobileMenu} 
                  className="md:hidden relative z-50 touch-manipulation"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  data-mobile-menu-trigger
                  style={{ minHeight: '44px', minWidth: '44px' }} // Ensure minimum touch target
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              )}

              <div className="flex-shrink-0">
                <UserMenu user={user} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation menu with improved mobile support */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}
            style={{ touchAction: 'manipulation' }}
          />
          {/* Mobile Menu */}
          <div className="fixed inset-x-0 top-24 z-50 md:hidden">
            <MobileMenu onNavigate={closeMobileMenu} />
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
