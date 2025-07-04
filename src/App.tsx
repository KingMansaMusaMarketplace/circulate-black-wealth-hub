
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import MobileAppWrapper from '@/components/mobile/MobileAppWrapper';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import pages
import HomePage from '@/pages/HomePage';
import BusinessDirectoryPage from '@/pages/BusinessDirectoryPage';
import QRScannerPage from '@/pages/QRScannerPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import CustomerSignupPage from '@/pages/CustomerSignupPage';
import BusinessSignupPage from '@/pages/BusinessSignupPage';
import DashboardPage from '@/pages/DashboardPage';
import BusinessFormPage from '@/pages/BusinessFormPage';
import LoyaltyPage from '@/pages/LoyaltyPage';
import CommunityImpactPage from '@/pages/CommunityImpactPage';
import BusinessDetailPage from '@/pages/BusinessDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import BlogPage from '@/pages/BlogPage';
import NotFound from '@/pages/NotFound';

// Import additional pages
import AboutUsPage from '@/pages/AboutUsPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import EducationPage from '@/pages/EducationPage';
import MentorshipPage from '@/pages/MentorshipPage';
import CorporateSponsorshipPage from '@/pages/CorporateSponsorshipPage';
import SalesAgentPage from '@/pages/SalesAgentPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import HelpCenterPage from '@/pages/HelpCenterPage';
import FAQPage from '@/pages/FAQPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import MobileReadinessTestPage from '@/pages/MobileReadinessTestPage';

// Import auth components
import RequireAuth from '@/components/auth/RequireAuth';

const App = () => {
  return (
    <ErrorBoundary>
      <MobileAppWrapper>
        <div className="App min-h-screen bg-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/directory" element={<BusinessDirectoryPage />} />
            <Route path="/business/:id" element={<BusinessDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup/customer" element={<CustomerSignupPage />} />
            <Route path="/signup/business" element={<BusinessSignupPage />} />
            <Route path="/business-form" element={<BusinessFormPage />} />
            <Route path="/community-impact" element={<CommunityImpactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/mentorship" element={<MentorshipPage />} />
            <Route path="/corporate-sponsorship" element={<CorporateSponsorshipPage />} />
            <Route path="/sales-agent" element={<SalesAgentPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
            <Route path="/mobile-readiness-test" element={<MobileReadinessTestPage />} />
            
            {/* Protected Routes */}
            <Route path="/scanner" element={
              <RequireAuth>
                <QRScannerPage />
              </RequireAuth>
            } />
            <Route path="/dashboard" element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            } />
            <Route path="/loyalty" element={
              <RequireAuth>
                <LoyaltyPage />
              </RequireAuth>
            } />
            <Route path="/profile" element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            } />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </MobileAppWrapper>
    </ErrorBoundary>
  );
};

export default App;
