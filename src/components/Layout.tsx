import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import ScreenshotModeToggle from './ScreenshotModeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Pages that should NOT have header/footer (full-screen experiences)
  const noLayoutPages = [
    '/scanner',
    '/qr-scanner',
  ];
  
  const shouldShowLayout = !noLayoutPages.includes(location.pathname);

  if (!shouldShowLayout) {
    return (
      <>
        {children}
        <ScreenshotModeToggle />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div data-tour="directory-link">
        <Navbar />
      </div>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ScreenshotModeToggle />
    </div>
  );
};

export default Layout;
