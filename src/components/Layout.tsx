import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import BottomTabBar from '@/components/mobile/BottomTabBar';
import { useCapacitor } from '@/hooks/use-capacitor';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isNative } = useCapacitor();
  
  // Pages that should NOT have header/footer (full-screen experiences)
  const noLayoutPages = [
    '/scanner',
    '/qr-scanner',
  ];
  
  // Pages that should show bottom tab bar on mobile
  const tabBarPages = ['/', '/directory', '/dashboard/profile', '/how-it-works'];
  const shouldShowTabBar = isNative && tabBarPages.includes(location.pathname);
  
  const shouldShowLayout = !noLayoutPages.includes(location.pathname);

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
        {children}
      </main>
      {!isNative && <Footer />}
      {shouldShowTabBar && <BottomTabBar />}
    </div>
  );
};

export default Layout;
