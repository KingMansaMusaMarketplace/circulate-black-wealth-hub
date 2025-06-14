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
import { initializeCaching, preloadResources, initializePerformanceMonitoring } from '@/utils/cacheOptimizer';

// Lazy load pages with better chunking strategy
const HomePage = React.lazy(() => import('@/pages/HomePage'));

// Group auth-related pages together
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const SignupPage = React.lazy(() => import('@/pages/SignupPage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));

// Group dashboard-related pages together
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const BusinessDashboardPage = React.lazy(() => import('@/pages/BusinessDashboardPage'));
const BusinessProfilePage = React.lazy(() => import('@/pages/BusinessProfilePage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));

// Group directory-related pages together
const DirectoryPage = React.lazy(() => import('@/pages/DirectoryPage'));
const EnhancedDirectoryPage = React.lazy(() => import('@/pages/EnhancedDirectoryPage'));
const BusinessDetailPage = React.lazy(() => import('@/pages/BusinessDetailPage'));

// Group QR-related pages together
const QRCodeGeneratorPage = React.lazy(() => import('@/pages/QRCodeGeneratorPage'));
const QRScannerPage = React.lazy(() => import('@/pages/QRScannerPage'));

// Group community-related pages together
const CommunityPage = React.lazy(() => import('@/pages/CommunityPage'));
const CommunityImpactPage = React.lazy(() => import('@/pages/CommunityImpactPage'));
const EconomicImpactPage = React.lazy(() => import('@/pages/EconomicImpactPage'));

// Group informational pages together
const AboutPage = React.lazy(() => import('@/pages/AboutPage'));
const BlogPage = React.lazy(() => import('@/pages/BlogPage'));
const ContactPage = React.lazy(() => import('@/pages/ContactPage'));
const FAQPage = React.lazy(() => import('@/pages/FAQPage'));
const HowItWorksPage = React.lazy(() => import('@/pages/HowItWorksPage'));
const CorporateSponsorshipPage = React.lazy(() => import('@/pages/CorporateSponsorshipPage'));
const HelpCenterPage = React.lazy(() => import('@/pages/HelpCenterPage'));

// Group admin pages together
const AdminPage = React.lazy(() => import('@/pages/AdminPage'));
const SalesAgentPage = React.lazy(() => import('@/pages/SalesAgentPage'));
const SubscriptionPage = React.lazy(() => import('@/pages/SubscriptionPage'));

// Group remaining pages
const LoyaltyPage = React.lazy(() => import('@/pages/LoyaltyPage'));
const CommunityImpactTestPage = React.lazy(() => import('@/pages/CommunityImpactTestPage'));
const StripeTestPage = React.lazy(() => import('@/pages/StripeTestPage'));
const SignupTestPage = React.lazy(() => import('@/pages/SignupTestPage'));
const SystemTestPage = React.lazy(() => import('@/pages/SystemTestPage'));
const CapacitorTestPage = React.lazy(() => import('@/pages/CapacitorTestPage'));

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Reduce unnecessary refetches
    },
  },
});

const OptimizedLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mansablue mx-auto"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    // Initialize all optimizations
    initializeCapacitorPlugins();
    initializeCaching();
    preloadResources();
    initializePerformanceMonitoring();
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
                    <Suspense fallback={<OptimizedLoadingSpinner />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        
                        {/* Auth Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/signup/:userType" element={<SignupPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        
                        {/* Dashboard Routes */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/business/dashboard" element={<BusinessDashboardPage />} />
                        <Route path="/business/profile" element={<BusinessProfilePage />} />
                        <Route path="/business/qr-codes" element={<QRCodeGeneratorPage />} />
                        
                        {/* Directory Routes */}
                        <Route path="/directory" element={<DirectoryPage />} />
                        <Route path="/directory/enhanced" element={<EnhancedDirectoryPage />} />
                        <Route path="/business/:id" element={<BusinessDetailPage />} />
                        
                        {/* QR & Scanner Routes */}
                        <Route path="/scanner" element={<QRScannerPage />} />
                        <Route path="/loyalty" element={<LoyaltyPage />} />
                        
                        {/* Community Routes */}
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/community-impact" element={<CommunityImpactPage />} />
                        <Route path="/community-impact/test" element={<CommunityImpactTestPage />} />
                        <Route path="/economic-impact" element={<EconomicImpactPage />} />
                        
                        {/* Information Routes */}
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/sponsorship" element={<CorporateSponsorshipPage />} />
                        <Route path="/corporate-sponsorship" element={<CorporateSponsorshipPage />} />
                        <Route path="/help" element={<HelpCenterPage />} />
                        
                        {/* Admin Routes */}
                        <Route path="/sales-agent" element={<SalesAgentPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/subscription" element={<SubscriptionPage />} />
                        
                        {/* Test Pages */}
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
