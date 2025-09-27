import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import WelcomeFlow from '@/components/onboarding/WelcomeFlow';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';

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
        {children}
      </main>
      
      {showFooter && <Footer />}
      
      {/* Onboarding Flow */}
      <WelcomeFlow isOpen={showWelcome} onClose={closeWelcome} />
    </div>
  );
};

export default MainLayout;