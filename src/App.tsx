import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { isCapacitorPlatform } from '@/utils/capacitor-plugins';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { NativeFeatures } from "@/components/native/NativeFeatures";
import { NativeFeaturesOnboarding } from "@/components/native/NativeFeaturesOnboarding";
import { AIChatWidget } from "@/components/ai-chat/AIChatWidget";
import { HelmetProvider } from 'react-helmet-async';
import { initializeCapacitorPlugins } from "@/utils/capacitor-plugins";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { BusinessOnboardingFlow } from "@/components/onboarding/BusinessOnboardingFlow";
import { CorporateOnboardingFlow } from "@/components/onboarding/CorporateOnboardingFlow";
import Layout from "@/components/Layout";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { RouteErrorBoundary } from "@/components/error-boundary/RouteErrorBoundary";
import "./index.css";

// Critical components (loaded immediately)
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';

// Import lazy components
import {
  LazyAboutPage,
  LazyDirectoryPage,
  LazyDashboardPage,
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
const LazyPaymentTestPage = lazy(() => import('@/pages/PaymentTestPage'));
const LazyFeatureGuidePage = lazy(() => import('@/pages/FeatureGuidePage'));
const LazyCorporateDashboardPage = lazy(() => import('@/pages/CorporateDashboardPage'));
const LazyPaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage'));
const LazyCorporateSponsorshipPricingPage = lazy(() => import('@/pages/CorporateSponsorshipPricingPage'));
const LazySponsorDashboardPage = lazy(() => import('@/pages/SponsorDashboardPage'));
const LazySponsorDashboard = lazy(() => import('@/pages/SponsorDashboard'));
const LazySponsorSuccessPage = lazy(() => import('@/pages/SponsorSuccessPage'));
const LazyAdminSponsorsPage = lazy(() => import('@/pages/AdminSponsorsPage'));
const LazyRefreshPage = lazy(() => import('@/pages/RefreshPage'));
const LazyAppleComplianceTestPage = lazy(() => import('@/pages/AppleComplianceTestPage'));
const LazyMasterAppleReviewTestPage = lazy(() => import('@/pages/MasterAppleReviewTestPage'));
const LazyNativeFeaturesDemo = lazy(() => import('@/pages/NativeFeaturesDemo'));
const LazyNativeFeaturesShowcase = lazy(() => import('@/pages/NativeFeaturesShowcase'));
const LazyRecommendationsPage = lazy(() => import('@/pages/RecommendationsPage'));
const LazyCommunityFinancePage = lazy(() => import('@/pages/CommunityFinancePage'));
const LazyUnifiedDashboard = lazy(() => import('@/pages/UnifiedDashboard'));
const LazyGroupChallengesPage = lazy(() => import('@/pages/GroupChallengesPage'));
const LazyReferralDashboard = lazy(() => import('@/pages/ReferralDashboard'));
const LazyShareImpactPage = lazy(() => import('@/pages/ShareImpactPage'));
const LazySocialProofPage = lazy(() => import('@/pages/SocialProofPage'));
const LazyNetworkPage = lazy(() => import('@/pages/NetworkPage'));
const LazyLeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));

// User profile pages
const LazyUserDashboardPage = lazy(() => import('@/pages/UserDashboardPage'));
const LazyUserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const LazyUserSettingsPage = lazy(() => import('@/pages/UserSettingsPage'));
const LazyBusinessAnalyticsPage = lazy(() => import('@/components/analytics/BusinessAnalyticsDashboard'));
const LazyCustomerBookingsPage = lazy(() => import('@/pages/CustomerBookingsPage'));
const LazyBusinessBookingsPage = lazy(() => import('@/pages/BusinessBookingsPage'));
const LazyBookBusinessPage = lazy(() => import('@/pages/BookBusinessPage'));
const LazyBusinessFinancesPage = lazy(() => import('@/pages/BusinessFinancesPage'));

// Remaining imports for compatibility (will be converted to lazy)
import RewardsPage from './pages/RewardsPage';
import QRScannerPage from './pages/QRScannerPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import BusinessDiscoveryPage from './pages/BusinessDiscoveryPage';
import SalesAgentSignupPage from './pages/SalesAgentSignupPage';
import SalesAgentGuidePage from './pages/SalesAgentGuidePage';
import SalesAgentDashboardPage from './pages/SalesAgentDashboardPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import ContactPage from './pages/ContactPage';
import SupportPage from './pages/SupportPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import BlogPage from './pages/BlogPage';
import HelpPage from './pages/HelpPage';
import AllPagesDirectory from './pages/AllPagesDirectory';

// Loading fallback component
const LoadingFallback: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  console.log('[LOADING FALLBACK] Showing loading screen:', message);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-gray-600">{message}</p>
        <Progress value={75} className="w-64 mx-auto" />
        <p className="text-xs text-gray-400 mt-4">v2025.01 - {new Date().toISOString()}</p>
      </div>
    </div>
  );
};

// Optimized QueryClient configuration for performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on mount if data exists
      retry: 1, // Retry failed requests once
    },
  },
});

function App() {
  const [appReady, setAppReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Capacitor plugins on app start
  useEffect(() => {
    console.log('[APP MOUNT] Component mounted, starting initialization');
    console.log('[APP MOUNT] User Agent:', navigator.userAgent);
    console.log('[APP MOUNT] Timestamp:', new Date().toISOString());
    
    let initTimeoutId: NodeJS.Timeout;
    
    const initializeApp = async () => {
      try {
        console.log('[APP INIT] Starting initialization...');
        console.log('[APP INIT] Environment:', import.meta.env.MODE);
        console.log('[APP INIT] Platform:', window?.Capacitor?.isNativePlatform?.() ? 'Native' : 'Web');
        console.log('[APP INIT] iOS Device:', /iPad|iPhone|iPod/.test(navigator.userAgent));
        
        // CRITICAL: Increased failsafe timeout from 2s to 3s
        // This gives more time for auth to initialize before forcing ready state
        initTimeoutId = setTimeout(() => {
          console.warn('[APP INIT] FAILSAFE: Force setting appReady to true after 3 seconds');
          console.warn('[APP INIT] This ensures the app never stays in loading state indefinitely');
          setAppReady(true);
        }, 3000);
        
        // Set app ready immediately to prevent blocking
        console.log('[APP INIT] Setting appReady to true');
        setAppReady(true);
        clearTimeout(initTimeoutId);
        console.log('[APP INIT] appReady state updated');
        
        // Dispatch app:ready event to hide boot fallback
        window.dispatchEvent(new Event('app:ready'));
        console.log('[APP INIT] app:ready event dispatched');
        
        // For native: hide splash and initialize plugins
        if (window?.Capacitor?.isNativePlatform?.()) {
          console.log('[APP INIT] Native platform detected');
          
          // CRITICAL: Force-hide splash screen immediately with failsafe
          const hideSplash = async () => {
            try {
              const { hideSplashScreen } = await import('@/utils/capacitor-plugins');
              await hideSplashScreen();
              console.log('[APP INIT] Splash hidden successfully');
            } catch (err) {
              console.error('[APP INIT] Splash hide error:', err);
            }
          };
          
          // Hide splash immediately
          hideSplash();
          
          // Failsafe: Force hide after 1 second even if first attempt failed
          setTimeout(hideSplash, 1000);
          
          // Initialize plugins in background (don't block on this)
          initializeCapacitorPlugins()
            .then(() => console.log('[APP INIT] Plugins initialized'))
            .catch(err => console.error('[APP INIT] Plugin init error:', err));
        } else {
          console.log('[APP INIT] Web platform ready');
        }
      } catch (err) {
        console.error('[APP INIT] Fatal error:', err);
        setError(err instanceof Error ? err.message : String(err));
        setAppReady(true); // Show error state
        clearTimeout(initTimeoutId);
        
        // Try to hide splash even on error
        if (window?.Capacitor?.isNativePlatform?.()) {
          try {
            import('@/utils/capacitor-plugins').then(({ hideSplashScreen }) => {
              hideSplashScreen().catch(() => {});
            });
          } catch {}
        }
      }
    };
    
    initializeApp();
    
    return () => {
      clearTimeout(initTimeoutId);
    };
  }, []);

  // Show user-friendly error if init failed
  if (error) {
    console.error('[APP ERROR] Displaying error screen:', error);
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'#0b1020',color:'#fff'}}>
        <div style={{maxWidth:'500px',textAlign:'center'}}>
          <h2 style={{color:'#f87171',marginBottom:'16px',fontSize:'20px',fontWeight:'600'}}>Unable to Start App</h2>
          <p style={{fontSize:'14px',opacity:0.9,marginBottom:'8px',lineHeight:'1.5'}}>
            The app encountered a problem during startup. This may be due to a network connection issue.
          </p>
          <p style={{fontSize:'12px',opacity:0.7,marginBottom:'16px',fontFamily:'monospace',padding:'12px',background:'rgba(255,255,255,0.1)',borderRadius:'6px'}}>
            {error}
          </p>
          <button 
            onClick={() => {
              console.log('[APP ERROR] User clicked reload button');
              window.location.reload();
            }} 
            style={{
              marginTop:'12px',
              padding:'12px 24px',
              background:'#1B365D',
              border:'none',
              borderRadius:'8px',
              color:'#fff',
              cursor:'pointer',
              fontSize:'14px',
              fontWeight:'500'
            }}
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  // Show loading screen while app initializes
  if (!appReady) {
    console.log('[APP INIT] Not ready, showing loader');
    return <LoadingFallback message="Loading Mansa Musa Marketplace..." />;
  }
  
  console.log('[APP INIT] Rendering main app');

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AnalyticsProvider>
              <SubscriptionProvider>
                <NativeFeatures>
                {/* Use HashRouter for Capacitor/native compatibility, BrowserRouter for web */}
                {isCapacitorPlatform() ? (
                  <HashRouter>
                    <AnalyticsTracker />
                    <TooltipProvider>
                    <div className="min-h-screen bg-background" role="application" aria-label="Mansa Musa Marketplace">
                      {/* Skip to main content link for keyboard navigation */}
                      <a href="#main-content" className="skip-link">
                        Skip to main content
                      </a>
                      
                      <div id="main-content" role="main">
                        <Suspense fallback={<LoadingFallback />}>
                          <Layout>
                            <Routes>
                              {/* All routes wrapped with error boundary */}
                              <Route errorElement={<RouteErrorBoundary />}>
                              <Route path="/" element={<HomePage />} />
                              <Route path="/all-pages" element={<AllPagesDirectory />} />
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
                              <Route path="/directory" element={<LazyDirectoryPage />} />
                              <Route path="/businesses" element={<BusinessDiscoveryPage />} />
                              <Route path="/sales-agent" element={<SalesAgentSignupPage />} />
                              <Route path="/sales-agent-signup" element={<SalesAgentSignupPage />} />
                              <Route path="/sales-agent-dashboard" element={<SalesAgentDashboardPage />} />
                              <Route path="/sales-agent-guide" element={<SalesAgentGuidePage />} />
                              <Route path="/sales-agent-leaderboard" element={<LazyLeaderboardPage />} />
                              <Route path="/become-a-sales-agent" element={<SalesAgentGuidePage />} />
                              <Route path="/business/:businessId" element={<BusinessDetailPage />} />
                              <Route path="/loyalty" element={<RewardsPage />} />
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
                              
                              <Route path="/dashboard" element={<LazyUnifiedDashboard />} />
                              <Route path="/user-dashboard" element={<LazyUserDashboardPage />} />
                              <Route path="/my-profile" element={<LazyUserProfilePage />} />
                              <Route path="/user-profile" element={<LazyUserProfilePage />} />
                              <Route path="/settings" element={<LazyUserSettingsPage />} />
                              <Route path="/user-settings" element={<LazyUserSettingsPage />} />
                              <Route path="/customer/bookings" element={<LazyCustomerBookingsPage />} />
                              <Route path="/recommendations" element={<LazyRecommendationsPage />} />
                              <Route path="/community-finance" element={<LazyCommunityFinancePage />} />
                              <Route path="/challenges" element={<LazyGroupChallengesPage />} />
                              <Route path="/referrals" element={<LazyReferralDashboard />} />
                              <Route path="/share-impact" element={<LazyShareImpactPage />} />
                              <Route path="/social-proof" element={<LazySocialProofPage />} />
                              <Route path="/network" element={<LazyNetworkPage />} />
                             
                              <Route path="/business-dashboard" element={<LazyDashboardPage />} />
                              <Route path="/business-analytics" element={<LazyBusinessAnalyticsPage />} />
                              <Route path="/business-finances" element={<LazyBusinessFinancesPage />} />
                              <Route path="/business/bookings" element={<LazyBusinessBookingsPage />} />
                              <Route path="/book/:businessId" element={<LazyBookBusinessPage />} />
                            
                              <Route path="/how-it-works" element={<LazyHowItWorksPage />} />
                              <Route path="/features" element={<LazyFeatureGuidePage />} />
                              <Route path="/scanner" element={<LazyQRScannerPage />} />
                              <Route path="/loyalty" element={<LazyLoyaltyPage />} />
                              <Route path="/community-impact" element={<LazyCommunityImpactPage />} />
                              <Route path="/corporate-sponsorship" element={<LazyCorporateSponsorshipPage />} />
                              <Route path="/sponsor-pricing" element={<LazyCorporateSponsorshipPricingPage />} />
                              <Route path="/sponsor-dashboard" element={<LazySponsorDashboardPage />} />
                              <Route path="/admin/sponsors" element={<LazyAdminSponsorsPage />} />
                              <Route path="/sponsor-success" element={<LazySponsorSuccessPage />} />
                              <Route path="/corporate-dashboard" element={<LazyCorporateDashboardPage />} />
                              <Route path="/payment-success" element={<LazyPaymentSuccessPage />} />
                              <Route path="/mobile-readiness-test" element={<LazyMobileReadinessTestPage />} />
                              <Route path="/full-app-test" element={<LazyFullAppTestPage />} />
                              <Route path="/full-system-test" element={<LazyFullSystemTestPage />} />
                              <Route path="/system-test" element={<LazySystemTestPage />} />
                              <Route path="/capacitor-test" element={<LazyCapacitorTestPage />} />
                              <Route path="/comprehensive-test" element={<LazyComprehensiveTestPage />} />
                              <Route path="/community-impact-test" element={<LazyCommunityImpactTestPage />} />
                              <Route path="/signup-test" element={<LazySignupTestPage />} />
                              <Route path="/payment-test" element={<LazyPaymentTestPage />} />
                              <Route path="/apple-compliance-test" element={<LazyAppleComplianceTestPage />} />
                              <Route path="/master-apple-review-test" element={<LazyMasterAppleReviewTestPage />} />
                              <Route path="/native-features-demo" element={<LazyNativeFeaturesDemo />} />
                              <Route path="/native-features-showcase" element={<LazyNativeFeaturesShowcase />} />
                              <Route path="/refresh" element={<LazyRefreshPage />} />
                              
                              <Route path="*" element={<NotFound />} />
                              </Route>
                            </Routes>
                          </Layout>
                        </Suspense>
                      </div>
                    </div>
                    <OnboardingFlow />
                    <BusinessOnboardingFlow />
                    <CorporateOnboardingFlow />
                    <NativeFeaturesOnboarding />
                    <AIChatWidget />
                    <Toaster />
                    <Sonner />
                  </TooltipProvider>
                  </HashRouter>
                ) : (
                  <BrowserRouter>
                    <AnalyticsTracker />
                  <TooltipProvider>
                  <div className="min-h-screen bg-background" role="application" aria-label="Mansa Musa Marketplace">
                    {/* Skip to main content link for keyboard navigation */}
                    <a href="#main-content" className="skip-link">
                      Skip to main content
                    </a>
                    
                    <div id="main-content" role="main">
                      <Suspense fallback={<LoadingFallback />}>
                        <Layout>
                          <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/all-pages" element={<AllPagesDirectory />} />
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
                        <Route path="/directory" element={<LazyDirectoryPage />} />
                        <Route path="/businesses" element={<BusinessDiscoveryPage />} />
                        <Route path="/sales-agent" element={<SalesAgentSignupPage />} />
                        <Route path="/sales-agent-signup" element={<SalesAgentSignupPage />} />
                        <Route path="/sales-agent-dashboard" element={<SalesAgentDashboardPage />} />
                        <Route path="/sales-agent-guide" element={<SalesAgentGuidePage />} />
                        <Route path="/sales-agent-leaderboard" element={<LazyLeaderboardPage />} />
                        <Route path="/become-a-sales-agent" element={<SalesAgentGuidePage />} />
                        <Route path="/business/:businessId" element={<BusinessDetailPage />} />
                        <Route path="/loyalty" element={<RewardsPage />} />
                        {/* Temporarily disabled to isolate iOS startup crash */}
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
                           <Route path="/dashboard" element={<LazyUnifiedDashboard />} />
                           <Route path="/user-dashboard" element={<LazyUserDashboardPage />} />
                           <Route path="/my-profile" element={<LazyUserProfilePage />} />
                          <Route path="/user-profile" element={<LazyUserProfilePage />} />
                          <Route path="/settings" element={<LazyUserSettingsPage />} />
                          <Route path="/user-settings" element={<LazyUserSettingsPage />} />
                          <Route path="/customer/bookings" element={<LazyCustomerBookingsPage />} />
                          <Route path="/recommendations" element={<LazyRecommendationsPage />} />
                          <Route path="/community-finance" element={<LazyCommunityFinancePage />} />
                           <Route path="/challenges" element={<LazyGroupChallengesPage />} />
                           <Route path="/referrals" element={<LazyReferralDashboard />} />
                           <Route path="/share-impact" element={<LazyShareImpactPage />} />
                           <Route path="/social-proof" element={<LazySocialProofPage />} />
                           <Route path="/network" element={<LazyNetworkPage />} />
                         
                          <Route path="/business-dashboard" element={<LazyDashboardPage />} />
                          <Route path="/business-analytics" element={<LazyBusinessAnalyticsPage />} />
                          <Route path="/business-finances" element={<LazyBusinessFinancesPage />} />
                          <Route path="/business/bookings" element={<LazyBusinessBookingsPage />} />
                          <Route path="/book/:businessId" element={<LazyBookBusinessPage />} />
                        
                        {/* Fixed How It Works route */}
                        <Route path="/how-it-works" element={<LazyHowItWorksPage />} />
                        <Route path="/features" element={<LazyFeatureGuidePage />} />
                        
                        {/* QR Scanner routes - both /scanner and /qr-scanner should work */}
                        <Route path="/scanner" element={<LazyQRScannerPage />} />
                        
                        {/* Fixed Loyalty route */}
                        <Route path="/loyalty" element={<LazyLoyaltyPage />} />
                        
                        {/* Fixed Community Impact route */}
                        <Route path="/community-impact" element={<LazyCommunityImpactPage />} />
                        
                        {/* Fixed Corporate Sponsorship route */}
                        <Route path="/corporate-sponsorship" element={<LazyCorporateSponsorshipPage />} />
                        <Route path="/sponsor-pricing" element={<LazyCorporateSponsorshipPricingPage />} />
                        <Route path="/sponsor-dashboard" element={<LazySponsorDashboardPage />} />
                        <Route path="/admin/sponsors" element={<LazyAdminSponsorsPage />} />
                        <Route path="/sponsor-success" element={<LazySponsorSuccessPage />} />
                        <Route path="/corporate-dashboard" element={<LazyCorporateDashboardPage />} />
                        <Route path="/payment-success" element={<LazyPaymentSuccessPage />} />
                        
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
                        <Route path="/payment-test" element={<LazyPaymentTestPage />} />
                        <Route path="/apple-compliance-test" element={<LazyAppleComplianceTestPage />} />
                        <Route path="/master-apple-review-test" element={<LazyMasterAppleReviewTestPage />} />
                        <Route path="/native-features-demo" element={<LazyNativeFeaturesDemo />} />
                        <Route path="/native-features-showcase" element={<LazyNativeFeaturesShowcase />} />
                        <Route path="/refresh" element={<LazyRefreshPage />} />
                        
                        {/* Catch all route for 404 */}
                        <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Layout>
                    </Suspense>
                  </div>
                </div>
                <OnboardingFlow />
                <BusinessOnboardingFlow />
                <CorporateOnboardingFlow />
                <NativeFeaturesOnboarding />
                <AIChatWidget />
                <Toaster />
                <Sonner />
              </TooltipProvider>
              </BrowserRouter>
                )}
            </NativeFeatures>
          </SubscriptionProvider>
        </AnalyticsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;