
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import NotificationBell from '@/components/notifications/NotificationBell';
import GlobalSearchModal from './GlobalSearchModal';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMobileMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggling mobile menu:', !mobileMenuOpen);
    setMobileMenuOpen(prev => !prev);
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

    // Increased delay for iOS touch event handling
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }, 300);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`bg-gradient-to-r from-slate-950/95 via-blue-950/95 to-slate-950/95 backdrop-blur-xl shadow-2xl z-50 w-full sticky top-0 border-b border-white/10 transition-all duration-300 ${className}`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-visible">
          <div className="flex h-16 items-center justify-between w-full gap-2 sm:gap-4 overflow-visible">
            <motion.div 
              className="flex items-center min-w-0 flex-shrink-0"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Logo />
              {!isMobile && (
                <div className="ml-8 hidden md:block">
                  <NavLinks />
                </div>
              )}
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0 overflow-visible"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="relative hover:bg-white/10 text-white/80 hover:text-mansagold transition-all duration-300 hover:scale-105 rounded-lg h-9 w-9 min-w-[36px] flex-shrink-0"
                aria-label="Search"
                title="Search (⌘K)"
              >
                <Search className="h-5 w-5" />
              </Button>

              {user && !isMobile && (
                <div className="transition-all duration-300 hover:scale-105">
                  <NotificationBell />
                </div>
              )}
              
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMobileMenu}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    toggleMobileMenu(e);
                  }}
                  className="md:hidden relative z-50 touch-manipulation hover:bg-white/10 text-white transition-all duration-300 hover:scale-105 rounded-lg select-none border border-white/10"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  data-mobile-menu-trigger
                  style={{ 
                    minHeight: '44px',
                    minWidth: '44px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 transition-transform rotate-90" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              )}

              <div className="flex-shrink-0">
                <UserMenu user={user} />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Mobile navigation menu with improved mobile support */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-40 md:hidden"
            onClick={closeMobileMenu}
            style={{ touchAction: 'manipulation' }}
          />
          {/* Mobile Menu */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 bottom-0 z-50 md:hidden overflow-y-auto overscroll-contain" 
            data-mobile-menu 
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <MobileMenu onNavigate={closeMobileMenu} onSearchOpen={() => setSearchOpen(true)} />
          </motion.div>
        </>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Navbar;
