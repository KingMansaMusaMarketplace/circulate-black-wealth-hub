import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCapacitor } from '@/hooks/use-capacitor';
import Navbar from './navbar/Navbar';
import Footer from './Footer';
import BottomTabBar from './mobile/BottomTabBar';

interface LayoutProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.2,
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isNative } = useCapacitor();
  
  // Pages that should NOT have header/footer (full-screen experiences)
  const noLayoutPages = [
    '/scanner',
    '/qr-scanner',
    '/admin-dashboard',
    '/business-dashboard',
    '/user-dashboard',
    '/dashboard',
    '/business',
  ];
  
  // On native apps, ALWAYS show bottom tab bar for navigation recovery
  // Users should never be stuck on a page with no way to navigate
  const shouldShowTabBar = isNative;
  
  // Check if current path matches any no-layout page (exact match or starts with)
  const shouldShowLayout = !noLayoutPages.some(page => 
    location.pathname === page || location.pathname.startsWith(page + '/')
  );

  if (!shouldShowLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isNative && (
        <div data-tour="directory-link">
          <Navbar />
        </div>
      )}
      <main className={`flex-1 ${shouldShowTabBar ? 'pb-16' : ''}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {!isNative && <Footer />}
      {shouldShowTabBar && <BottomTabBar />}
    </div>
  );
};

export default Layout;
