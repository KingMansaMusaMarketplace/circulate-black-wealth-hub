
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './index.css';

// Import providers - using the correct AuthProvider
import AuthProvider from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';

// Import pages
import App from './App';
import AboutPage from '@/pages/AboutPage';
import DirectoryPage from '@/pages/DirectoryPage';
import BusinessDetailPage from '@/pages/BusinessDetailPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import CommunityImpactPage from '@/pages/CommunityImpactPage';
import SignupPage from '@/pages/SignupPage';
import BusinessSignupPage from '@/pages/BusinessSignupPage';
import CustomerSignupPage from '@/pages/CustomerSignupPage';
import LoginPage from '@/pages/LoginPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import CorporateSponsorshipPage from '@/pages/CorporateSponsorshipPage';
import SalesAgentPage from '@/pages/SalesAgentPage';
import ProfilePage from '@/pages/ProfilePage';
import BusinessDashboardPage from '@/pages/BusinessDashboardPage';
import DashboardPage from '@/pages/DashboardPage';
import QRScannerPage from '@/pages/QRScannerPage';
import EducationPage from '@/pages/EducationPage';
import MentorshipPage from '@/pages/MentorshipPage';
import LoyaltyPage from '@/pages/LoyaltyPage';
import BlogPage from '@/pages/BlogPage';
import HelpPage from '@/pages/HelpPage';
import FAQPage from '@/pages/FAQPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import ContactPage from '@/pages/ContactPage';
import RegistrationTestPage from '@/pages/RegistrationTestPage';
import SignupTestPage from '@/pages/SignupTestPage';
import SystemTestPage from '@/pages/SystemTestPage';
import BusinessFormPage from '@/pages/BusinessFormPage';

// Import the new dashboard router
import DashboardRouter from '@/components/dashboard/DashboardRouter';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscriptionProvider>
            <Router>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/directory" element={<DirectoryPage />} />
                <Route path="/business/:id" element={<BusinessDetailPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/community-impact" element={<CommunityImpactPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/signup/business" element={<BusinessSignupPage />} />
                <Route path="/signup/customer" element={<CustomerSignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/sponsorship" element={<CorporateSponsorshipPage />} />
                <Route path="/corporate-sponsorship" element={<CorporateSponsorshipPage />} />
                <Route path="/sales-agent" element={<SalesAgentPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/business-form" element={<BusinessFormPage />} />
                
                {/* Dashboard routes */}
                <Route path="/dashboard" element={<DashboardRouter />} />
                <Route path="/dashboard/business" element={<BusinessDashboardPage />} />
                <Route path="/dashboard/customer" element={<DashboardPage />} />
                
                <Route path="/scanner" element={<QRScannerPage />} />
                <Route path="/education" element={<EducationPage />} />
                <Route path="/mentorship" element={<MentorshipPage />} />
                <Route path="/loyalty" element={<LoyaltyPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/test/registration" element={<RegistrationTestPage />} />
                <Route path="/test/signup" element={<SignupTestPage />} />
                <Route path="/test/system" element={<SystemTestPage />} />
              </Routes>
              <Toaster />
            </Router>
          </SubscriptionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
