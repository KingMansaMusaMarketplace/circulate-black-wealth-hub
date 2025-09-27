import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { NativeFeatures } from "@/components/native/NativeFeatures";
import { HelmetProvider } from 'react-helmet-async';
import { initializeCapacitorPlugins } from "@/utils/capacitor-plugins";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { BusinessOnboardingFlow } from "@/components/onboarding/BusinessOnboardingFlow";
import { CorporateOnboardingFlow } from "@/components/onboarding/CorporateOnboardingFlow";
import "./index.css";

// Critical components (loaded immediately)
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';

// Import lazy components
import {
  LazyAboutPage,
  LazyDirectoryPage,
  LazyDashboardPage,
  LazyEducationPage,
  LazyMentorshipPage,
  LazyLoyaltyPage,
  LazyCommunityImpactPage,
  LazyCorporateSponsorshipPage,
  LazyQRScannerPage,
  LazyBusinessDetailPage,
  LazySubscriptionPage,
  LazyStripeTestPage,
  LazyProfilePage,
  LazyMobileReadinessTestPage,
  LazyFullAppTestPage,
  LazyCommunityImpactTestPage,
  LazySignupTestPage,
  LazyBusinessSignupPage,
  LazyBusinessFormPage,
  LazyLoginPage,
  LazySignupPage,
  LazyPasswordResetRequestPage,
  LazyResetPasswordPage,
  LazyHowItWorksPage,
  LazySystemTestPage,
  LazyFullSystemTestPage,
  LazyAccessibilityPage,
  LazyCapacitorTestPage,
  LazyComprehensiveTestPage
} from './components/LazyComponents';

// Auth page (new) - import directly since it's not in LazyComponents yet
const LazyAuthPage = lazy(() => import('@/pages/AuthPage'));
const LazyEmailVerified = lazy(() => import('@/pages/EmailVerified'));

// Remaining imports for compatibility (will be converted to lazy)
import QRScannerPage from './pages/QRScannerPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import BusinessDiscoveryPage from './pages/BusinessDiscoveryPage';
import SalesAgentSignupPage from './pages/SalesAgentSignupPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import ContactPage from './pages/ContactPage';
import SupportPage from './pages/SupportPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import BlogPage from './pages/BlogPage';
import HelpPage from './pages/HelpPage';

// Loading fallback component
const LoadingFallback: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansablue mx-auto"></div>
      <p className="text-gray-600">{message}</p>
      <Progress value={75} className="w-64 mx-auto" />
    </div>
  </div>
);

const queryClient = new QueryClient();

function App() {
  // Initialize Capacitor plugins on app start
  useEffect(() => {
    initializeCapacitorPlugins();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscriptionProvider>
            <NativeFeatures>
              <BrowserRouter>
                <TooltipProvider>
                  <div className="min-h-screen bg-background" role="application" aria-label="Mansa Musa Marketplace">
                    {/* Skip to main content link for keyboard navigation */}
                    <a href="#main-content" className="skip-link">
                      Skip to main content
                    </a>
                    
                    <div id="main-content" role="main">
                      <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<LazyAuthPage />} />
                        <Route path="/login" element={<LazyLoginPage />} />
                        <Route path="/signup" element={<LazySignupPage />} />
                        <Route path="/email-verified" element={<LazyEmailVerified />} />
                      
                        {/* Business signup routes - support both URL patterns */}
                        <Route path="/business-signup" element={<LazyBusinessSignupPage />} />
                        <Route path="/signup/business" element={<LazyBusinessSignupPage />} />
                        
                        {/* Business form route */}
                        <Route path="/business-form" element={<LazyBusinessFormPage />} />
                        
                        {/* Password reset routes */}
                        <Route path="/reset-password" element={<LazyPasswordResetRequestPage />} />
                        <Route path="/password-reset" element={<LazyResetPasswordPage />} />
                        
                        <Route path="/profile" element={<LazyProfilePage />} />
                        <Route path="/subscription" element={<LazySubscriptionPage />} />
                        <Route path="/businesses" element={<BusinessDiscoveryPage />} />
                        <Route path="/sales-agent" element={<SalesAgentSignupPage />} />
                        <Route path="/business/:businessId" element={<BusinessDetailPage />} />
                        <Route path="/scanner" element={<QRScannerPage />} />
                        <Route path="/directory" element={<LazyDirectoryPage />} />
                        <Route path="/about" element={<LazyAboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/support" element={<SupportPage />} />
                        <Route path="/terms" element={<TermsOfServicePage />} />
                        <Route path="/privacy" element={<PrivacyPolicyPage />} />
                        <Route path="/cookies" element={<CookiePolicyPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/testing/signup" element={<LazySignupTestPage />} />
                        <Route path="/accessibility" element={<LazyAccessibilityPage />} />
                        
                        {/* Fixed Dashboard route */}
                        <Route path="/dashboard" element={<LazyDashboardPage />} />
                        
                        {/* Fixed How It Works route */}
                        <Route path="/how-it-works" element={<LazyHowItWorksPage />} />
                        
                        {/* Fixed Education route */}
                        <Route path="/education" element={<LazyEducationPage />} />
                        
                        {/* Fixed Mentorship route */}
                        <Route path="/mentorship" element={<LazyMentorshipPage />} />
                        
                        {/* QR Scanner routes - both /scanner and /qr-scanner should work */}
                        <Route path="/scanner" element={<LazyQRScannerPage />} />
                        
                        {/* Fixed Loyalty route */}
                        <Route path="/loyalty" element={<LazyLoyaltyPage />} />
                        
                        {/* Fixed Community Impact route */}
                        <Route path="/community-impact" element={<LazyCommunityImpactPage />} />
                        
                        {/* Fixed Corporate Sponsorship route */}
                        <Route path="/corporate-sponsorship" element={<LazyCorporateSponsorshipPage />} />
                        
                        {/* Fixed Mobile Readiness Test route */}
                        <Route path="/mobile-readiness-test" element={<LazyMobileReadinessTestPage />} />
                        
                        {/* Full App Test route */}
                        <Route path="/full-app-test" element={<LazyFullAppTestPage />} />
                        
                        {/* Full System Test route */}
                        <Route path="/full-system-test" element={<LazyFullSystemTestPage />} />
                        
                        {/* System Test route */}
                        <Route path="/system-test" element={<LazySystemTestPage />} />
                        
                        {/* Capacitor Test route */}
                        <Route path="/capacitor-test" element={<LazyCapacitorTestPage />} />
                        
                        {/* Comprehensive Test route */}
                        <Route path="/comprehensive-test" element={<LazyComprehensiveTestPage />} />
                        <Route path="/community-impact-test" element={<LazyCommunityImpactTestPage />} />
                        <Route path="/signup-test" element={<LazySignupTestPage />} />
                        
                        {/* Catch all route for 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </div>
                </div>
                <OnboardingFlow />
                <BusinessOnboardingFlow />
                <CorporateOnboardingFlow />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </BrowserRouter>
            </NativeFeatures>
          </SubscriptionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;