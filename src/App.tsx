
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { HelmetProvider } from 'react-helmet-async';
import "./index.css";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BusinessSignupPage from './pages/BusinessSignupPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import SalesAgentSignupPage from './pages/SalesAgentSignupPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import QRScannerPage from './pages/QRScannerPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import NotFound from './pages/NotFound';
import SignupTestPage from './pages/SignupTestPage';
import AccessibilityPage from "@/pages/AccessibilityPage";
import DirectoryPage from './pages/DirectoryPage';
import HowItWorksPage from './pages/HowItWorksPage';
import EducationPage from './pages/EducationPage';
import MentorshipPage from './pages/MentorshipPage';
import LoyaltyPage from './pages/LoyaltyPage';
import CommunityImpactPage from './pages/CommunityImpactPage';
import DashboardPage from './pages/DashboardPage';
import CorporateSponsorshipPage from './pages/CorporateSponsorshipPage';
import MobileReadinessTestPage from './pages/MobileReadinessTestPage';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscriptionProvider>
            <BrowserRouter>
              <TooltipProvider>
                <div className="min-h-screen bg-background" role="application" aria-label="Mansa Musa Marketplace">
                  {/* Skip to main content link for keyboard navigation */}
                  <a href="#main-content" className="skip-link">
                    Skip to main content
                  </a>
                  
                  <div id="main-content" role="main">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      
                      {/* Business signup routes - support both URL patterns */}
                      <Route path="/business-signup" element={<BusinessSignupPage />} />
                      <Route path="/signup/business" element={<BusinessSignupPage />} />
                      
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/subscription" element={<SubscriptionPage />} />
                      <Route path="/sales-agent" element={<SalesAgentSignupPage />} />
                      <Route path="/business/:businessId" element={<BusinessProfilePage />} />
                      <Route path="/qr-scanner" element={<QRScannerPage />} />
                      <Route path="/directory" element={<DirectoryPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/terms" element={<TermsOfServicePage />} />
                      <Route path="/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/cookies" element={<CookiePolicyPage />} />
                      <Route path="/testing/signup" element={<SignupTestPage />} />
                      <Route path="/accessibility" element={<AccessibilityPage />} />
                      
                      {/* Fixed Dashboard route */}
                      <Route path="/dashboard" element={<DashboardPage />} />
                      
                      {/* Fixed How It Works route */}
                      <Route path="/how-it-works" element={<HowItWorksPage />} />
                      
                      {/* Fixed Education route */}
                      <Route path="/education" element={<EducationPage />} />
                      
                      {/* Fixed Mentorship route */}
                      <Route path="/mentorship" element={<MentorshipPage />} />
                      
                      {/* QR Scanner routes - both /scanner and /qr-scanner should work */}
                      <Route path="/scanner" element={<QRScannerPage />} />
                      
                      {/* Fixed Loyalty route */}
                      <Route path="/loyalty" element={<LoyaltyPage />} />
                      
                      {/* Fixed Community Impact route */}
                      <Route path="/community-impact" element={<CommunityImpactPage />} />
                      
                      {/* Fixed Corporate Sponsorship route */}
                      <Route path="/corporate-sponsorship" element={<CorporateSponsorshipPage />} />
                      
                      {/* Fixed Mobile Readiness Test route */}
                      <Route path="/mobile-readiness-test" element={<MobileReadinessTestPage />} />
                      
                      {/* Catch all route for 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </div>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </BrowserRouter>
          </SubscriptionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
