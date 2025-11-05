import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import BottomTabBar from '@/components/mobile/BottomTabBar';
import { Capacitor } from '@capacitor/core';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isNative = Capacitor.isNativePlatform();
  
  // Main app pages that use bottom tab navigation (native app style)
  const mainAppPages = [
    '/',
    '/directory',
    '/loyalty',
    '/dashboard',
    '/business-dashboard',
  ];
  
  // Pages that should be completely full-screen (no navigation at all)
  const fullScreenPages = [
    '/scanner',
    '/qr-scanner',
  ];
  
  const isMainAppPage = mainAppPages.some(page => 
    page === '/' ? location.pathname === '/' : location.pathname.startsWith(page)
  );
  const isFullScreen = fullScreenPages.includes(location.pathname);
  
  // Use native-style navigation for main app pages, traditional web nav for others
  const showWebLayout = !isMainAppPage && !isFullScreen;
  const showBottomTabs = isMainAppPage && !isFullScreen;

  // Full-screen pages (scanner, etc.)
  if (isFullScreen) {
    return <>{children}</>;
  }

  // Native-style app with bottom tabs (no header/footer)
  if (showBottomTabs) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 pb-16">
          {children}
        </main>
        <BottomTabBar />
      </div>
    );
  }

  // Traditional web layout (header + footer) for other pages
  return (
    <div className="flex flex-col min-h-screen">
      <div data-tour="directory-link">
        <Navbar />
      </div>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
