import React, { Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import ErrorBoundary from '@/components/ErrorBoundary';
import MobileAppWrapper from '@/components/mobile/MobileAppWrapper';
import { SafeAreaProvider } from '@/components/mobile/SafeAreaProvider';
import { initializeCapacitorPlugins } from '@/utils/capacitor-plugins';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const AboutPage = React.lazy(() => import('@/pages/AboutPage'));
const ContactPage = React.lazy(() => import('@/pages/ContactPage'));
const DirectoryPage = React.lazy(() => import('@/pages/DirectoryPage'));
const EnhancedDirectoryPage = React.lazy(() => import('@/pages/EnhancedDirectoryPage'));
const BusinessDetailPage = React.lazy(() => import('@/pages/BusinessDetailPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const BusinessDashboardPage = React.lazy(() => import('@/pages/BusinessDashboardPage'));
const BusinessProfilePage = React.lazy(() => import('@/pages/BusinessProfilePage'));
const QRCodeGeneratorPage = React.lazy(() => import('@/pages/QRCodeGeneratorPage'));
const QRScannerPage = React.lazy(() => import('@/pages/QRScannerPage'));
const LoyaltyPage = React.lazy(() => import('@/pages/LoyaltyPage'));
const CommunityPage = React.lazy(() => import('@/pages/CommunityPage'));
const CommunityImpactPage = React.lazy(() => import('@/pages/CommunityImpactPage'));
const CommunityImpactTestPage = React.lazy(() => import('@/pages/CommunityImpactTestPage'));
const EconomicImpactPage = React.lazy(() => import('@/pages/EconomicImpactPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const HelpCenterPage = React.lazy(() => import('@/pages/HelpCenterPage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const SignupPage = React.lazy(() => import('@/pages/SignupPage'));
const SalesAgentPage = React.lazy(() => import('@/pages/SalesAgentPage'));
const AdminPage = React.lazy(() => import('@/pages/AdminPage'));
const HowItWorksPage = React.lazy(() => import('@/pages/HowItWorksPage'));
const CorporateSponsorshipPage = React.lazy(() => import('@/pages/CorporateSponsorshipPage'));
const SubscriptionPage = React.lazy(() => import('@/pages/SubscriptionPage'));
const StripeTestPage = React.lazy(() => import('@/pages/StripeTestPage'));
const SignupTestPage = React.lazy(() => import('@/pages/SignupTestPage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const SystemTestPage = React.lazy(() => import('@/pages/SystemTestPage'));
const CapacitorTestPage = React.lazy(() => import('@/pages/CapacitorTestPage'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mansablue"></div>
  </div>
);

function App() {
  useEffect(() => {
    // Initialize Capacitor plugins when app starts
    initializeCapacitorPlugins();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscriptionProvider>
            <SafeAreaProvider>
              <MobileAppWrapper>
                <Router>
                  <PerformanceMonitor />
                  <div className="min-h-screen bg-white">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/sponsorship" element={<CorporateSponsorshipPage />} />
                        <Route path="/corporate-sponsorship" element={<CorporateSponsorshipPage />} />
                        <Route path="/directory" element={<DirectoryPage />} />
                        <Route path="/directory/enhanced" element={<EnhancedDirectoryPage />} />
                        <Route path="/business/:id" element={<BusinessDetailPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/business/dashboard" element={<BusinessDashboardPage />} />
                        <Route path="/business/profile" element={<BusinessProfilePage />} />
                        <Route path="/business/qr-codes" element={<QRCodeGeneratorPage />} />
                        <Route path="/scanner" element={<QRScannerPage />} />
                        <Route path="/loyalty" element={<LoyaltyPage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/community-impact" element={<CommunityImpactPage />} />
                        <Route path="/community-impact/test" element={<CommunityImpactTestPage />} />
                        <Route path="/economic-impact" element={<EconomicImpactPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/help" element={<HelpCenterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/signup/:userType" element={<SignupPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/sales-agent" element={<SalesAgentPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/subscription" element={<SubscriptionPage />} />
                        <Route path="/stripe-test" element={<StripeTestPage />} />
                        <Route path="/signup-test" element={<SignupTestPage />} />
                        <Route path="/system-test" element={<SystemTestPage />} />
                        <Route path="/capacitor-test" element={<CapacitorTestPage />} />
                      </Routes>
                    </Suspense>
                  </div>
                  <Toaster 
                    position="top-right" 
                    richColors 
                    closeButton
                    toastOptions={{
                      duration: 4000,
                    }}
                  />
                </Router>
              </MobileAppWrapper>
            </SafeAreaProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
