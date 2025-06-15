
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/auth/AuthProvider";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import HomePage from "@/pages/HomePage";
import DirectoryPage from "@/pages/DirectoryPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ProfilePage from "@/pages/ProfilePage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import CorporateSponsorshipPage from "@/pages/CorporateSponsorshipPage";
import ContactPage from "@/pages/ContactPage";
import AboutPage from "@/pages/AboutPage";
import TestPage from "@/pages/TestPage";
import MobileTestPage from "@/pages/MobileTestPage";
import CapacitorTestPage from "@/pages/CapacitorTestPage";
import CommunityImpactTestPage from "@/pages/CommunityImpactTestPage";
import RegistrationTestPage from "@/pages/RegistrationTestPage";
import SystemTestPage from "@/pages/SystemTestPage";
import MobileAppWrapper from "@/components/mobile/MobileAppWrapper";
import QRCodeScannerV2 from "@/components/QRScannerV2";
import ComprehensiveTestPage from "@/pages/ComprehensiveTestPage";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // Set a custom CSS property for the status bar height on iOS
    if (typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream) {
      const setStatusBarHeight = () => {
        const statusBarHeight = window.innerWidth > window.innerHeight ? '20px' : '44px';
        document.documentElement.style.setProperty('--status-bar-height', statusBarHeight);
      };

      setStatusBarHeight();
      window.addEventListener('resize', setStatusBarHeight);

      return () => {
        window.removeEventListener('resize', setStatusBarHeight);
      };
    }
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscriptionProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <MobileAppWrapper>
                  <div className="min-h-screen bg-background">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/directory" element={<DirectoryPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/subscription" element={<SubscriptionPage />} />
                      <Route path="/corporate-sponsorship" element={<CorporateSponsorshipPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/test" element={<TestPage />} />
                      <Route path="/mobile-test" element={<MobileTestPage />} />
                      <Route path="/capacitor-test" element={<CapacitorTestPage />} />
                      <Route path="/community-impact-test" element={<CommunityImpactTestPage />} />
                      <Route path="/registration-test" element={<RegistrationTestPage />} />
                      <Route path="/system-test" element={<SystemTestPage />} />
                      <Route path="/scanner-v2" element={<QRCodeScannerV2 />} />
                      <Route path="/comprehensive-test" element={<ComprehensiveTestPage />} />
                    </Routes>
                  </div>
                </MobileAppWrapper>
              </BrowserRouter>
            </TooltipProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
