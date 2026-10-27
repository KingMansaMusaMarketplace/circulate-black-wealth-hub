import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCapacitor } from '@/hooks/use-capacitor';
import Navbar from './navbar/Navbar';
import Footer from './Footer';
import BottomTabBar from './mobile/BottomTabBar';
import BackToButton from './ui/BackToButton';
import HolidayAnnouncementBar from './homepage/HolidayAnnouncementBar';

interface LayoutProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.2,
} as const;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isNative } = useCapacitor();
  const impactPaths = ['/impact', '/community-impact', '/economic-impact'];
  const pageAnimationKey = impactPaths.includes(location.pathname)
    ? 'impact-dashboard'
    : location.pathname;
  
  // Pages that should NOT have header/footer (full-screen experiences)
  // Note: dashboards previously hid the navbar, but users got stranded with no
  // way to navigate. Top navbar now shows on all dashboards.
  const noLayoutPages = [
    '/scanner',
    '/qr-scanner',
    '/admin-dashboard',
    '/business',
    '/health',
  ];
  
  // On native apps, ALWAYS show bottom tab bar for navigation recovery
  // Users should never be stuck on a page with no way to navigate
  const shouldShowTabBar = isNative;

  // The flagship owns its public navigation; other routes retain the existing shell.
  const isFlagship = (location.pathname === '/' || location.pathname === '/os-tour' || location.pathname === '/os-dashboard' || (location.pathname === '/business-signup' && new URLSearchParams(location.search).get('focus') === 'true')) && !(typeof window !== 'undefined' && window.location.hostname.startsWith('health.'));
  if (isFlagship) return <>{children}{shouldShowTabBar && <BottomTabBar />}</>;
  
  // Check if current path matches any no-layout page (exact match or starts with)
  const isHealthHost = typeof window !== 'undefined' && window.location.hostname.startsWith('health.');
  const shouldShowLayout = !isHealthHost && !noLayoutPages.some(page => 
    location.pathname === page || location.pathname.startsWith(page + '/')
  );

  if (!shouldShowLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {!isNative && (
        <div data-tour="directory-link">
          <HolidayAnnouncementBar />
          <Navbar />
        </div>
      )}
      <main className={`flex-1 bg-black ${shouldShowTabBar ? 'pb-16' : ''}`}>
        {/* Lazy routes can suspend during navigation. An exit-wait boundary can
            leave the incoming page at opacity zero, so animate entry only. */}
          <motion.div
            key={pageAnimationKey}
            initial="initial"
            animate="animate"
            variants={pageVariants}
            transition={pageTransition}
          >
            <BackToButton />
            {children}
          </motion.div>
      </main>
      {!isNative && <Footer />}
      {shouldShowTabBar && <BottomTabBar />}
    </div>
  );
};

export default Layout;

