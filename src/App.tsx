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
import BusinessPage from "@/pages/BusinessPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import SignupCustomerPage from "@/pages/SignupCustomerPage";
import SignupBusinessPage from "@/pages/SignupBusinessPage";
import SignupSponsorPage from "@/pages/SignupSponsorPage";
import ProfilePage from "@/pages/ProfilePage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import CorporateSponsorshipPage from "@/pages/CorporateSponsorshipPage";
import ContactPage from "@/pages/ContactPage";
import AboutPage from "@/pages/AboutPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import PasswordResetPage from "@/pages/PasswordResetPage";
import PasswordUpdatePage from "@/pages/PasswordUpdatePage";
import TestPage from "@/pages/TestPage";
import MobileTestPage from "@/pages/MobileTestPage";
import CapacitorTestPage from "@/pages/CapacitorTestPage";
import CommunityImpactTestPage from "@/pages/CommunityImpactTestPage";
import RegistrationTestPage from "@/pages/RegistrationTestPage";
import ScannerPage from "@/pages/ScannerPage";
import SystemTestPage from "@/pages/SystemTestPage";
import MobileAppWrapper from "@/components/mobile/MobileAppWrapper";
import QRCodeScannerV2 from "@/components/QRScannerV2";
import BusinessDashboardPage from "@/pages/business/BusinessDashboardPage";
import BusinessProfilePage from "@/pages/business/BusinessProfilePage";
import BusinessProductsPage from "@/pages/business/BusinessProductsPage";
import BusinessCouponsPage from "@/pages/business/BusinessCouponsPage";
import BusinessAnalyticsPage from "@/pages/business/BusinessAnalyticsPage";
import BusinessSettingsPage from "@/pages/business/BusinessSettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SponsorDashboardPage from "@/pages/sponsor/SponsorDashboardPage";
import SponsorProfilePage from "@/pages/sponsor/SponsorProfilePage";
import SponsorSettingsPage from "@/pages/sponsor/SponsorSettingsPage";
import SponsorNotificationsPage from "@/pages/sponsor/SponsorNotificationsPage";
import SponsorAnalyticsPage from "@/pages/sponsor/SponsorAnalyticsPage";
import SponsorBenefitsPage from "@/pages/sponsor/SponsorBenefitsPage";
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
                      <Route path="/business/:id" element={<BusinessPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/signup/customer" element={<SignupCustomerPage />} />
                      <Route path="/signup/business" element={<SignupBusinessPage />} />
                      <Route path="/signup/sponsor" element={<SignupSponsorPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/subscription" element={<SubscriptionPage />} />
                      <Route path="/corporate-sponsorship" element={<CorporateSponsorshipPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/reset-password" element={<PasswordResetPage />} />
                      <Route path="/update-password" element={<PasswordUpdatePage />} />
                      <Route path="/test" element={<TestPage />} />
                      <Route path="/mobile-test" element={<MobileTestPage />} />
                      <Route path="/capacitor-test" element={<CapacitorTestPage />} />
                      <Route path="/community-impact-test" element={<CommunityImpactTestPage />} />
                      <Route path="/registration-test" element={<RegistrationTestPage />} />
                      <Route path="/scanner" element={<ScannerPage />} />
                      <Route path="/system-test" element={<SystemTestPage />} />
                      <Route path="/scanner-v2" element={<QRCodeScannerV2 />} />

                      {/* Business Routes */}
                      <Route path="/business/dashboard" element={<BusinessDashboardPage />} />
                      <Route path="/business/profile" element={<BusinessProfilePage />} />
                      <Route path="/business/products" element={<BusinessProductsPage />} />
                      <Route path="/business/coupons" element={<BusinessCouponsPage />} />
                      <Route path="/business/analytics" element={<BusinessAnalyticsPage />} />
                      <Route path="/business/settings" element={<BusinessSettingsPage />} />

                      {/* Sponsor Routes */}
                      <Route path="/sponsor/dashboard" element={<SponsorDashboardPage />} />
                      <Route path="/sponsor/profile" element={<SponsorProfilePage />} />
                      <Route path="/sponsor/settings" element={<SponsorSettingsPage />} />
                      <Route path="/sponsor/notifications" element={<SponsorNotificationsPage />} />
                      <Route path="/sponsor/analytics" element={<SponsorAnalyticsPage />} />
                      <Route path="/sponsor/benefits" element={<SponsorBenefitsPage />} />

                      <Route path="*" element={<NotFoundPage />} />
                      
                      {/* Add the new comprehensive test route */}
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
