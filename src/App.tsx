
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import PerformanceMonitor from '@/components/PerformanceMonitor';

// Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import DirectoryPage from '@/pages/DirectoryPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ContactPage from '@/pages/ContactPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import CommunityPage from '@/pages/CommunityPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import CorporateSponsorshipPage from '@/pages/CorporateSponsorshipPage';
import SalesAgentPage from '@/pages/SalesAgentPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import FAQPage from '@/pages/FAQPage';
import HelpPage from '@/pages/HelpPage';
import BlogPage from '@/pages/BlogPage';

// Dashboard and protected pages
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import BusinessDashboardPage from '@/pages/BusinessDashboardPage';
import BusinessProfilePage from '@/pages/BusinessProfilePage';
import QRCodeManagementPage from '@/pages/QRCodeManagementPage';
import QRScannerPage from '@/pages/QRScannerPage';
import LoyaltyPage from '@/pages/LoyaltyPage';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  console.log('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <SubscriptionProvider>
            <ErrorBoundary>
              <Router>
                <div className="min-h-screen bg-background w-full overflow-x-hidden">
                  <PerformanceMonitor />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/directory" element={<DirectoryPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/sponsorship" element={<CorporateSponsorshipPage />} />
                    <Route path="/sales-agent" element={<SalesAgentPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/business/dashboard" element={<BusinessDashboardPage />} />
                    <Route path="/business/profile" element={<BusinessProfilePage />} />
                    <Route path="/business/qr-codes" element={<QRCodeManagementPage />} />
                    <Route path="/scanner" element={<QRScannerPage />} />
                    <Route path="/loyalty" element={<LoyaltyPage />} />
                  </Routes>
                  <Toaster />
                </div>
              </Router>
            </ErrorBoundary>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
