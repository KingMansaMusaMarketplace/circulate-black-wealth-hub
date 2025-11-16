import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Building2, Users, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingNav = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Don't show FloatingNav on auth pages
  const authPages = ['/login', '/signup', '/business-signup', '/password-reset-request', '/reset-password'];
  const isAuthPage = authPages.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show nav after scrolling down 100px
      if (currentScrollY > 100) {
        // Hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/directory', label: 'Directory', icon: Building2 },
    { path: '/how-it-works', label: 'How It Works', icon: Users },
  ];

  // Return null after all hooks are called
  if (isAuthPage) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
        >
          <div className="glass-card backdrop-blur-xl bg-background/80 border border-border/50 rounded-2xl shadow-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
                  <span className="text-mansablue-dark font-bold text-sm">MM</span>
                </div>
                <span className="font-display font-bold text-foreground hidden sm:inline">
                  MansaMusa
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 font-body text-sm transition-colors ${
                        isActive
                          ? 'text-mansagold font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="hidden md:block">
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-gold text-mansablue-dark hover:opacity-90 font-semibold shadow-lg"
                >
                  <Link to="/signup">Join Free</Link>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-foreground"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-border/30 space-y-3">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 font-body text-sm py-2 px-3 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-mansagold/10 text-mansagold font-semibold'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-gradient-gold text-mansablue-dark hover:opacity-90 font-semibold"
                    >
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        Join Free
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;
