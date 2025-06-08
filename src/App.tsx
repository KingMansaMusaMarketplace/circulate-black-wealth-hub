
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/auth';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RequireAuth from '@/components/auth/RequireAuth';
import RequireCustomer from '@/components/auth/RequireCustomer';
import RequireBusiness from '@/components/auth/RequireBusiness';
import RequireSalesAgent from '@/components/auth/RequireSalesAgent';

// Lazy load components for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));
const BusinessDirectoryPage = lazy(() => import('@/pages/BusinessDirectoryPage'));
const BusinessDetailPage = lazy(() => import('@/pages/BusinessDetailPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const CustomerSignupPage = lazy(() => import('@/pages/CustomerSignupPage'));
const BusinessSignupPage = lazy(() => import('@/pages/BusinessSignupPage'));
const SalesAgentSignupPage = lazy(() => import('@/pages/SalesAgentSignupPage'));
const SignupSuccessPage = lazy(() => import('@/pages/SignupSuccessPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const NewPasswordPage = lazy(() => import('@/pages/NewPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const BusinessDashboardPage = lazy(() => import('@/pages/BusinessDashboardPage'));
const SalesAgentDashboardPage = lazy(() => import('@/pages/SalesAgentDashboardPage'));
const SalesAgentPage = lazy(() => import('@/pages/SalesAgentPage'));
const QRScannerPage = lazy(() => import('@/pages/QRScannerPage'));
const QRCodeScannerV2Page = lazy(() => import('@/pages/QRCodeScannerV2Page'));
const QRCodeGeneratorPage = lazy(() => import('@/pages/QRCodeGeneratorPage'));
const QRCodeManagementPage = lazy(() => import('@/pages/QRCodeManagementPage'));
const LoyaltyPage = lazy(() => import('@/pages/LoyaltyPage'));
const LoyaltyHistoryPage = lazy(() => import('@/pages/LoyaltyHistoryPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const BusinessProfilePage = lazy(() => import('@/pages/BusinessProfilePage'));
const SubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'));
const EconomicImpactPage = lazy(() => import('@/pages/EconomicImpactPage'));
const CommunityPage = lazy(() => import('@/pages/CommunityPage'));
const HelpCenterPage = lazy(() => import('@/pages/HelpCenterPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const CorporateSponsorshipPage = lazy(() => import('@/pages/CorporateSponsorshipPage'));
const TestimonialsPage = lazy(() => import('@/pages/TestimonialsPage'));
const ReferralPage = lazy(() => import('@/pages/ReferralPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const AdminVerificationPage = lazy(() => import('@/pages/AdminVerificationPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
const CookiePolicyPage = lazy(() => import('@/pages/CookiePolicyPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Testing pages
const SignupTestPage = lazy(() => import('@/pages/SignupTestPage'));
const RegistrationTestPage = lazy(() => import('@/pages/RegistrationTestPage'));
const HBCUTestPage = lazy(() => import('@/pages/HBCUTestPage'));
const CapacitorTestPage = lazy(() => import('@/pages/CapacitorTestPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <Router>
                <div className="flex flex-col min-h-screen">
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/how-it-works" element={<HowItWorksPage />} />
                      <Route path="/businesses" element={<BusinessDirectoryPage />} />
                      <Route path="/directory" element={<BusinessDirectoryPage />} />
                      <Route path="/business/:id" element={<BusinessDetailPage />} />
                      <Route path="/testimonials" element={<TestimonialsPage />} />
                      <Route path="/sponsorship" element={<CorporateSponsorshipPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/help" element={<HelpCenterPage />} />
                      <Route path="/community" element={<CommunityPage />} />
                      <Route path="/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms" element={<TermsOfServicePage />} />
                      <Route path="/cookies" element={<CookiePolicyPage />} />
                      <Route path="/faq" element={<FAQPage />} />

                      {/* Auth routes */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/signup/customer" element={<CustomerSignupPage />} />
                      <Route path="/signup/business" element={<BusinessSignupPage />} />
                      <Route path="/signup/sales-agent" element={<SalesAgentSignupPage />} />
                      <Route path="/signup-success" element={<SignupSuccessPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="/new-password" element={<NewPasswordPage />} />

                      {/* Protected routes */}
                      <Route path="/dashboard" element={
                        <RequireAuth>
                          <DashboardPage />
                        </RequireAuth>
                      } />

                      <Route path="/business-dashboard" element={
                        <RequireBusiness>
                          <BusinessDashboardPage />
                        </RequireBusiness>
                      } />

                      <Route path="/sales-agent-dashboard" element={
                        <RequireSalesAgent>
                          <SalesAgentDashboardPage />
                        </RequireSalesAgent>
                      } />

                      <Route path="/sales-agent" element={<SalesAgentPage />} />

                      <Route path="/scanner" element={
                        <RequireCustomer>
                          <QRScannerPage />
                        </RequireCustomer>
                      } />

                      <Route path="/scanner-v2" element={
                        <RequireCustomer>
                          <QRCodeScannerV2Page />
                        </RequireCustomer>
                      } />

                      <Route path="/qr-generator" element={
                        <RequireBusiness>
                          <QRCodeGeneratorPage />
                        </RequireBusiness>
                      } />

                      <Route path="/qr-management" element={
                        <RequireBusiness>
                          <QRCodeManagementPage />
                        </RequireBusiness>
                      } />

                      <Route path="/loyalty" element={
                        <RequireCustomer>
                          <LoyaltyPage />
                        </RequireCustomer>
                      } />

                      <Route path="/loyalty-history" element={
                        <RequireCustomer>
                          <LoyaltyHistoryPage />
                        </RequireCustomer>
                      } />

                      <Route path="/profile" element={
                        <RequireAuth>
                          <ProfilePage />
                        </RequireAuth>
                      } />

                      <Route path="/business-profile" element={
                        <RequireBusiness>
                          <BusinessProfilePage />
                        </RequireBusiness>
                      } />

                      <Route path="/subscription" element={
                        <RequireAuth>
                          <SubscriptionPage />
                        </RequireAuth>
                      } />

                      <Route path="/economic-impact" element={
                        <RequireAuth>
                          <EconomicImpactPage />
                        </RequireAuth>
                      } />

                      <Route path="/referral" element={
                        <RequireAuth>
                          <ReferralPage />
                        </RequireAuth>
                      } />

                      {/* Admin routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboardPage />
                        </ProtectedRoute>
                      } />

                      <Route path="/admin/verification" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminVerificationPage />
                        </ProtectedRoute>
                      } />

                      {/* Testing routes */}
                      <Route path="/test/signup" element={<SignupTestPage />} />
                      <Route path="/test/registration" element={<RegistrationTestPage />} />
                      <Route path="/test/hbcu" element={<HBCUTestPage />} />
                      <Route path="/test/capacitor" element={<CapacitorTestPage />} />

                      {/* 404 route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  
                  <Toaster />
                </div>
              </Router>
            </SubscriptionProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
