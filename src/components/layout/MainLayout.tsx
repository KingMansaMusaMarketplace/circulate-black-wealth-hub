import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import WelcomeFlow from '@/components/onboarding/WelcomeFlow';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import BackToButton from '@/components/ui/BackToButton';
import PWAInstallBanner from '@/components/pwa/PWAInstallBanner';

interface MainLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showNavbar = true, 
  showFooter = true,
  className = ""
}) => {
  const { showWelcome, closeWelcome } = useOnboardingFlow();

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {showNavbar && <Navbar />}
      
      <main className="flex-1">
        <EmailVerificationBanner />
        <div className="container mx-auto px-4 pt-2">
          <BackToButton />
        </div>
        {children}
      </main>
      
      {showFooter && <Footer />}
      
      {/* Onboarding Flow */}
      <WelcomeFlow isOpen={showWelcome} onClose={closeWelcome} />
      
      {/* PWA Install Prompt */}
      <PWAInstallBanner />
    </div>
  );
};

export default MainLayout;