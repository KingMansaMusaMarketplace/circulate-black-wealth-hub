
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  title,
  showNavbar = true,
  showFooter = true,
  className = '',
  fullWidth = false
}) => {
  const isMobile = useIsMobile();
  
  // Fix scrolling behavior when navigating between pages on mobile
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      
      {title && (
        <div className="bg-gradient-to-r from-mansablue to-mansablue-dark py-6 px-4">
          <div className={`${fullWidth ? 'w-full' : 'container mx-auto'}`}>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
          </div>
        </div>
      )}
      
      <main className={`flex-grow ${className}`}>
        <div className={`${fullWidth ? 'w-full' : 'container mx-auto'} px-4 py-6 md:py-8`}>
          {children}
        </div>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default ResponsiveLayout;
