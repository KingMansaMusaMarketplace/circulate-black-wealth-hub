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
import { GuestProvider } from "@/contexts/GuestContext";
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
import IOSProtectedRoute from "@/components/routing/IOSProtectedRoute";
import FloatingNav from "@/components/navigation/FloatingNav";
import BusinessProfilePrompt from "@/components/business/BusinessProfilePrompt";
import { GlobalErrorRecovery } from "@/components/error-recovery/GlobalErrorRecovery";
import { OfflineBanner } from "@/components/network/OfflineBanner";
import ScrollToTop from "@/components/ScrollToTop";
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

// Media Kit page
const LazyMediaKitPage = lazy(() => import('@/pages/MediaKitPage'));

// Coalition & B2B pages
const LazyCoalitionPage = lazy(() => import('@/pages/CoalitionPage'));
const LazyB2BMarketplacePage = lazy(() => import('@/pages/B2BMarketplacePage'));
const LazyB2BDashboardPage = lazy(() => import('@/pages/business/B2BDashboardPage'));
const LazyLeadsDashboardPage = lazy(() => import('@/pages/LeadsDashboardPage'));
const LazyEducationPage = lazy(() => import('@/pages/EducationPage'));
const LazyRewardsPage = lazy(() => import('@/pages/RewardsPage'));

const LazySalesAgentSignupPage = lazy(() => import('@/pages/SalesAgentSignupPage'));
const LazySalesAgentGuidePage = lazy(() => import('@/pages/SalesAgentGuidePage'));
const LazySalesAgentDashboardPage = lazy(() => import('@/pages/SalesAgentDashboardPage'));
const LazyBusinessProfilePage = lazy(() => import('@/pages/BusinessProfilePage'));
const LazyContactPage = lazy(() => import('@/pages/ContactPage'));
const LazySupportPage = lazy(() => import('@/pages/SupportPage'));
const LazyTermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
const LazyPrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const LazyCookiePolicyPage = lazy(() => import('@/pages/CookiePolicyPage'));
const LazyBlogPage = lazy(() => import('@/pages/BlogPage'));
const LazyHelpPage = lazy(() => import('@/pages/HelpPage'));
const LazyUserGuidePage = lazy(() => import('@/pages/UserGuidePage'));
const LazyAllPagesDirectory = lazy(() => import('@/pages/AllPagesDirectory'));

// Auth page (new) - import directly since it's not in LazyComponents yet
const LazyAuthPage = lazy(() => import('@/pages/AuthPage'));
const LazyEmailVerified = lazy(() => import('@/pages/EmailVerified'));
const LazyIOSBlockedPage = lazy(() => import('@/pages/IOSBlockedPage'));
const LazyPaymentTestPage = lazy(() => import('@/pages/PaymentTestPage'));
const LazyFeatureGuidePage = lazy(() => import('@/pages/FeatureGuidePage'));
const LazyAppTestPage = lazy(() => import('@/pages/AppTestPage'));
const LazyErrorPage = lazy(() => import('@/pages/ErrorPage'));
const LazyCorporateDashboardPage = lazy(() => import('@/pages/CorporateDashboardPage'));
const LazyPaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage'));
const LazyListingSuccessPage = lazy(() => import('@/pages/ListingSuccessPage'));
const LazyCorporateSponsorshipPricingPage = lazy(() => import('@/pages/CorporateSponsorshipPricingPage'));
const LazySponsorDashboardPage = lazy(() => import('@/pages/SponsorDashboardPage'));

const LazyFullAppTest = lazy(() => import('@/pages/FullAppTest'));
const LazyTestingHub = lazy(() => import('@/pages/TestingHub'));
const LazySponsorDashboard = lazy(() => import('@/pages/SponsorDashboard'));
const LazySponsorSuccessPage = lazy(() => import('@/pages/SponsorSuccessPage'));
const LazyAdminSponsorsPage = lazy(() => import('@/pages/AdminSponsorsPage'));
const LazyAdminSponsorDetailPage = lazy(() => import('@/pages/AdminSponsorDetailPage'));
const LazyRefreshPage = lazy(() => import('@/pages/RefreshPage'));
const LazyFeatureDiscoveryPage = lazy(() => import('@/components/onboarding/FeatureDiscovery'));
const LazyCustomersPage = lazy(() => import('@/pages/CustomersPage'));
const LazyCustomerDetailPage = lazy(() => import('@/pages/CustomerDetailPage'));
const LazyNewCustomerPage = lazy(() => import('@/pages/NewCustomerPage'));
const LazyAppleComplianceTestPage = lazy(() => import('@/pages/AppleComplianceTestPage'));
const LazyPreSubmissionChecklistPage = lazy(() => import('@/pages/PreSubmissionChecklistPage'));
const LazyMasterAppleReviewTestPage = lazy(() => import('@/pages/MasterAppleReviewTestPage'));
const LazyNativeFeaturesDemo = lazy(() => import('@/pages/NativeFeaturesDemo'));
const LazyNativeFeaturesShowcase = lazy(() => import('@/pages/NativeFeaturesShowcase'));
const LazyRecommendationsPage = lazy(() => import('@/pages/RecommendationsPage'));
const LazyCommunityPage = lazy(() => import('@/pages/CommunityPage'));
const LazyCommunityFinancePage = lazy(() => import('@/pages/CommunityFinancePage'));
const LazyUnifiedDashboard = lazy(() => import('@/pages/UnifiedDashboard'));
const LazyGroupChallengesPage = lazy(() => import('@/pages/GroupChallengesPage'));
const LazyReferralDashboard = lazy(() => import('@/pages/ReferralDashboard'));
const LazyShareImpactPage = lazy(() => import('@/pages/ShareImpactPage'));
const LazySocialProofPage = lazy(() => import('@/pages/SocialProofPage'));
const LazyFeaturesPage = lazy(() => import('@/pages/FeaturesPage'));
const LazyFAQPage = lazy(() => import('@/pages/FAQPage'));
const LazyCustomerSignupPage = lazy(() => import('@/pages/CustomerSignupPage'));
const LazyNetworkPage = lazy(() => import('@/pages/NetworkPage'));
const LazyLeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const LazyImpactPage = lazy(() => import('@/pages/ImpactPage'));
const LazyCommissionsPage = lazy(() => import('@/pages/admin/CommissionsPage'));
const LazyCommissionReportsPage = lazy(() => import('@/pages/business/CommissionReportsPage'));
const LazyBusinessHowItWorksPage = lazy(() => import('@/pages/business/HowItWorksPage'));
const LazyButtonTestPage = lazy(() => import('@/pages/ButtonTestPage'));
const LazyEmailCopyPage = lazy(() => import('@/pages/EmailCopyPage'));
const LazyAIAssistantPage = lazy(() => import('@/pages/AIAssistantPage'));
const LazyAdminFraudDetectionPage = lazy(() => import('@/pages/AdminFraudDetectionPage'));
const LazyAdminSentimentAnalysisPage = lazy(() => import('@/pages/AdminSentimentAnalysisPage'));
const LazyLearningHubPage = lazy(() => import('@/pages/LearningHubPage'));
const LazyLoyaltyProgramGuidePage = lazy(() => import('@/pages/LoyaltyProgramGuidePage'));
const LazyAdminPage = lazy(() => import('@/pages/AdminPage'));
const LazyAdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const LazyAdminVerificationPage = lazy(() => import('@/pages/AdminVerificationPage'));
const LazyAdminEmailListPage = lazy(() => import('@/pages/AdminEmailListPage'));
const LazyAdminEmailAnalyticsPage = lazy(() => import('@/pages/admin/EmailAnalyticsPage'));
const LazyQRTestPage = lazy(() => import('@/pages/QRTestPage'));
const LazyVerifyCertificatePage = lazy(() => import('@/pages/VerifyCertificatePage'));

// Unified Test Dashboard (consolidates all test pages)
const LazyUnifiedTestDashboard = lazy(() => import('@/pages/UnifiedTestDashboard'));

// Coming Soon page (for archived features)
const LazyComingSoonPage = lazy(() => import('@/pages/ComingSoonPage'));
const LazyClaimBusinessPage = lazy(() => import('@/pages/ClaimBusinessPage'));

// PWA Install page
const LazyInstallPage = lazy(() => import('@/pages/InstallPage'));

// Growth System pages
const LazyAdminBusinessImport = lazy(() => import('@/pages/AdminBusinessImport'));
const LazyAdminSponsorCRM = lazy(() => import('@/pages/AdminSponsorCRM'));

// Investor & Ambassador pages
const LazyInvestorPage = lazy(() => import('@/pages/InvestorPage'));
const LazyMansaAmbassadorsPage = lazy(() => import('@/pages/MansaAmbassadorsPage'));
const LazyPitchDeckPage = lazy(() => import('@/pages/PitchDeckPage'));
const LazyPartnershipFrameworkPage = lazy(() => import('@/pages/PartnershipFrameworkPage'));
const LazyPartnerPortal = lazy(() => import('@/pages/PartnerPortal'));

// Partner Pitch Pages
const LazyEatOkraPartnershipPage = lazy(() => import('@/pages/partners/EatOkraPartnershipPage'));

// Susu, Karma & Wallet pages
const LazySusuCirclesPage = lazy(() => import('@/pages/SusuCirclesPage'));
const LazyKarmaDashboardPage = lazy(() => import('@/pages/KarmaDashboardPage'));
const LazyWalletPage = lazy(() => import('@/pages/WalletPage'));

// Vacation Rentals (Mansa Stays)
const LazyVacationRentalsPage = lazy(() => import('@/pages/VacationRentalsPage'));
const LazyPropertyDetailPage = lazy(() => import('@/pages/PropertyDetailPage'));
const LazyPropertyListingPage = lazy(() => import('@/pages/PropertyListingPage'));
const LazyHostDashboardPage = lazy(() => import('@/pages/HostDashboardPage'));
const LazyGuestBookingsPage = lazy(() => import('@/pages/GuestBookingsPage'));
const LazyStaysMessagesPage = lazy(() => import('@/pages/StaysMessagesPage'));

// Founder's Wall
const LazyFoundersWallPage = lazy(() => import('@/pages/FoundersWallPage'));
const LazyAmbassadorResourcesPage = lazy(() => import('@/pages/AmbassadorResourcesPage'));
const LazySalesAgentCodeOfConductPage = lazy(() => import('@/pages/SalesAgentCodeOfConductPage'));

// User profile pages
const LazyUserDashboardPage = lazy(() => import('@/pages/UserDashboardPage'));
const LazyUserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const LazyUserSettingsPage = lazy(() => import('@/pages/UserSettingsPage'));
const LazyBusinessAnalyticsPage = lazy(() => import('@/components/analytics/BusinessAnalyticsDashboard'));
const LazyCustomerBookingsPage = lazy(() => import('@/pages/CustomerBookingsPage'));
const LazyBusinessBookingsPage = lazy(() => import('@/pages/BusinessBookingsPage'));
const LazyBookBusinessPage = lazy(() => import('@/pages/BookBusinessPage'));
const LazyBusinessFinancesPage = lazy(() => import('@/pages/BusinessFinancesPage'));

// Lazy load marketing pages
const LazyMarketingMaterialsPage = lazy(() => import('./pages/MarketingMaterialsPage'));
const LazyAdminMarketingMaterialsPage = lazy(() => import('./pages/AdminMarketingMaterialsPage'));
const LazyMarketingAnalyticsPage = lazy(() => import('./pages/MarketingAnalyticsPage'));

// Onboarding & Welcome pages
const LazyWelcomePage = lazy(() => import('@/pages/WelcomePage'));
const LazyBusinessOnboardingPage = lazy(() => import('@/pages/business/BusinessOnboardingPage'));

// Patent Document Export
const LazyPatentDocumentExport = lazy(() => import('@/pages/PatentDocumentExport'));

// Workflow & Helpdesk pages
const LazyWorkflowBuilderPage = lazy(() => import('@/pages/WorkflowBuilderPage'));
const LazyKnowledgeBasePage = lazy(() => import('@/pages/KnowledgeBasePage'));
const LazySubmitTicketPage = lazy(() => import('@/pages/SubmitTicketPage'));
const LazyMyTicketsPage = lazy(() => import('@/pages/MyTicketsPage'));

// AI Agent Dashboard
const LazyAIAgentDashboard = lazy(() => import('@/pages/AIAgentDashboard'));

// Developer Platform pages
const LazyDeveloperLandingPage = lazy(() => import('@/pages/developers/DeveloperLandingPage'));
const LazyDeveloperDashboard = lazy(() => import('@/pages/developers/DeveloperDashboard'));
const LazyDeveloperSignupPage = lazy(() => import('@/pages/developers/DeveloperSignupPage'));
const LazyApiDocumentationPage = lazy(() => import('@/pages/developers/ApiDocumentationPage'));
const LazyApiPricingPage = lazy(() => import('@/pages/developers/ApiPricingPage'));
const LazySdkDocumentationPage = lazy(() => import('@/pages/developers/SdkDocumentationPage'));
const LazyShowcaseGalleryPage = lazy(() => import('@/pages/developers/ShowcaseGalleryPage'));

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
  // CRITICAL: Start with appReady=true to NEVER show loading screen
  // This ensures iOS app launches immediately without any spinner
  const [appReady, setAppReady] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRecoverableError, setHasRecoverableError] = useState(false);

  // CRITICAL: Global unhandled rejection handler to prevent white screen crashes
  // This catches async errors that ErrorBoundary cannot catch
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('[APP] Unhandled promise rejection:', event.reason);
      
      // Prevent the default behavior (which can crash the app on iOS)
      event.preventDefault();
      
      // Set recoverable error state instead of crashing
      setHasRecoverableError(true);
      
      // Log for debugging
      const errorMsg = event.reason?.message || String(event.reason);
      console.error('[APP] Prevented crash from:', errorMsg);
    };

    const handleGlobalError = (event: ErrorEvent) => {
      console.error('[APP] Global error caught:', event.message);
      
      // For chunk loading errors, try to reload
      if (event.message?.includes('ChunkLoadError') || 
          event.message?.includes('Loading chunk') ||
          event.message?.includes('Failed to fetch dynamically imported module')) {
        console.log('[APP] Chunk error detected, attempting recovery...');
        event.preventDefault();
        // Don't reload immediately - let the error recovery UI show
        setHasRecoverableError(true);
        return;
      }
      
      // Prevent crash for other errors
      event.preventDefault();
      setHasRecoverableError(true);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  // Initialize Capacitor plugins on app start (non-blocking)
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isIPad = /iPad/.test(navigator.userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isNative = window?.Capacitor?.isNativePlatform?.();
    
    console.log('[APP MOUNT] Started - iOS:', isIOS, 'iPad:', isIPad, 'Native:', isNative);
    console.log('[APP MOUNT] UA:', navigator.userAgent.substring(0, 100));
    console.log('[APP MOUNT] Timestamp:', new Date().toISOString());
    
    // Dispatch app:ready immediately to hide any boot fallback
    window.dispatchEvent(new Event('app:ready'));
    
    // For native apps: hide splash screen immediately with extra safety
    if (isNative) {
      const hideSplash = async () => {
        try {
          const { hideSplashScreen } = await import('@/utils/capacitor-plugins');
          await hideSplashScreen();
          console.log('[APP] Splash hidden');
        } catch (err) {
          // Don't let splash hide failure crash the app
          console.error('[APP] Splash hide error (non-fatal):', err);
        }
      };
      
      // Hide splash immediately and again after 500ms as failsafe
      hideSplash().catch(() => {});
      setTimeout(() => hideSplash().catch(() => {}), 500);
      setTimeout(() => hideSplash().catch(() => {}), 1000); // Extra failsafe for iPad
      
      // Initialize plugins in background (non-blocking, with error swallowing)
      initializeCapacitorPlugins()
        .then(() => console.log('[APP] Plugins ready'))
        .catch(err => {
          // Don't let plugin errors crash the app
          console.error('[APP] Plugin error (non-fatal):', err);
        });
    }
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
            <GuestProvider>
              <AnalyticsProvider>
                <SubscriptionProvider>
                  <NativeFeatures>
                {/* Use HashRouter for Capacitor/native compatibility, BrowserRouter for web */}
                {isCapacitorPlatform() ? (
                  <HashRouter>
                    <ScrollToTop />
                    <AnalyticsTracker />
                    <TooltipProvider>
                    <div className="min-h-screen bg-background" role="application" aria-label="Mansa Musa Marketplace">
                      {/* Skip to main content link for keyboard navigation */}
                      <a href="#main-content" className="skip-link">
                        Skip to main content
                      </a>
                      
                      <div id="main-content" role="main">
                        <FloatingNav />
                        <BusinessProfilePrompt />
                        <OfflineBanner />
                        <GlobalErrorRecovery />
                        <Suspense fallback={<LoadingFallback />}>
                          <Layout>
                            <Routes>
                              {/* All routes wrapped with error boundary */}
                              <Route errorElement={<RouteErrorBoundary />}>
                              {/* Home */}
                              <Route path="/" element={<HomePage />} />
                              
                              {/* A */}
                              <Route path="/about" element={<LazyAboutPage />} />
                              <Route path="/accessibility" element={<LazyAccessibilityPage />} />
                              {/* Admin - consolidated to single dashboard */}
                              <Route path="/admin" element={<LazyAdminDashboardPage />} />
                              <Route path="/admin-dashboard" element={<LazyAdminDashboardPage />} />
                              <Route path="/admin/commissions" element={<LazyCommissionsPage />} />
                              <Route path="/admin/email-list" element={<LazyAdminEmailListPage />} />
                              <Route path="/admin/emails" element={<LazyAdminEmailAnalyticsPage />} />
                              <Route path="/admin/fraud-detection" element={<LazyAdminFraudDetectionPage />} />
                              <Route path="/admin/marketing-analytics" element={<LazyMarketingAnalyticsPage />} />
                              <Route path="/admin/marketing-materials" element={<LazyAdminMarketingMaterialsPage />} />
                              <Route path="/admin/sentiment-analysis" element={<LazyAdminSentimentAnalysisPage />} />
<Route path="/admin/sponsors" element={<LazyAdminSponsorsPage />} />
                              <Route path="/admin/sponsors/:id" element={<LazyAdminSponsorDetailPage />} />
                              <Route path="/admin/verification" element={<LazyAdminVerificationPage />} />
                              <Route path="/admin/business-import" element={<LazyAdminBusinessImport />} />
                              <Route path="/admin/sponsor-crm" element={<LazyAdminSponsorCRM />} />
                              <Route path="/ai-assistant" element={<LazyAIAssistantPage />} />
                              <Route path="/all-pages" element={<LazyAllPagesDirectory />} />
                              <Route path="/apple-compliance" element={<LazyAppleComplianceTestPage />} />
                              <Route path="/apple-compliance-test" element={<LazyAppleComplianceTestPage />} />
                              <Route path="/auth" element={<LazyAuthPage />} />
                              
                              {/* B */}
                              <Route path="/become-a-sales-agent" element={<LazySalesAgentGuidePage />} />
                              <Route path="/blog" element={<LazyBlogPage />} />
                              <Route path="/book/:businessId" element={<LazyBookBusinessPage />} />
                              <Route path="/business-analytics" element={
                                <IOSProtectedRoute>
                                  <LazyBusinessAnalyticsPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business-dashboard" element={
                                <IOSProtectedRoute>
                                  <LazyDashboardPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business-finances" element={
                                <IOSProtectedRoute>
                                  <LazyBusinessFinancesPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business-form" element={
                                <IOSProtectedRoute>
                                  <LazyBusinessFormPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business-signup" element={
                                <IOSProtectedRoute>
                                  <LazyBusinessSignupPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business/bookings" element={
                                <IOSProtectedRoute>
                                  <LazyBusinessBookingsPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business/how-it-works" element={<LazyBusinessHowItWorksPage />} />
                              <Route path="/business/b2b-dashboard" element={<LazyB2BDashboardPage />} />
                              <Route path="/business/register" element={
                                <IOSProtectedRoute>
                                  <LazyBusinessSignupPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business/:businessId" element={<LazyBusinessDetailPage />} />
                              <Route path="/business/:businessId/commissions" element={<LazyCommissionReportsPage />} />
                              <Route path="/button-test" element={<LazyButtonTestPage />} />
                              <Route path="/b2b-marketplace" element={<LazyComingSoonPage />} />
                              <Route path="/leads-dashboard" element={<LazyComingSoonPage />} />
                              
                              {/* C */}
                              <Route path="/capacitor-test" element={<LazyCapacitorTestPage />} />
                              <Route path="/challenges" element={<LazyGroupChallengesPage />} />
                              <Route path="/claim-business" element={<LazyClaimBusinessPage />} />
                              <Route path="/coalition" element={<LazyCoalitionPage />} />
                              <Route path="/community" element={<LazyCommunityPage />} />
                              <Route path="/community" element={<LazyCommunityPage />} />
                              <Route path="/community-finance" element={<LazyCommunityFinancePage />} />
                              <Route path="/community-impact" element={<LazyCommunityImpactPage />} />
                              <Route path="/community-impact-test" element={<LazyCommunityImpactTestPage />} />
                              <Route path="/comprehensive-test" element={<LazyUnifiedTestDashboard />} />
                              <Route path="/contact" element={<LazyContactPage />} />
                              <Route path="/cookies" element={<LazyCookiePolicyPage />} />
                              <Route path="/corporate-dashboard" element={<LazyCorporateDashboardPage />} />
                              <Route path="/corporate-sponsorship" element={<LazyCorporateSponsorshipPage />} />
                              <Route path="/customer/bookings" element={<LazyCustomerBookingsPage />} />
                              <Route path="/customers" element={<LazyCustomersPage />} />
                              <Route path="/customers/new" element={<LazyNewCustomerPage />} />
                              <Route path="/customers/:customerId" element={<LazyCustomerDetailPage />} />
                              
                              {/* D */}
                              <Route path="/dashboard" element={<LazyUnifiedDashboard />} />
                              <Route path="/developers" element={<LazyComingSoonPage />} />
                              <Route path="/developers/dashboard" element={<LazyComingSoonPage />} />
                              <Route path="/developers/signup" element={<LazyComingSoonPage />} />
                              <Route path="/developers/docs" element={<LazyComingSoonPage />} />
                              <Route path="/developers/pricing" element={<LazyComingSoonPage />} />
                              <Route path="/developers/sdks" element={<LazyComingSoonPage />} />
                              <Route path="/developers/showcase" element={<LazyComingSoonPage />} />
                              <Route path="/directory" element={<LazyDirectoryPage />} />
                              
                              {/* E */}
                              <Route path="/education" element={<LazyEducationPage />} />
                              <Route path="/email-copy" element={<LazyEmailCopyPage />} />
                              <Route path="/email-verified" element={<LazyEmailVerified />} />
                              <Route path="/error" element={<LazyErrorPage />} />
                              
                              {/* F */}
                              <Route path="/faq" element={<LazyFAQPage />} />
                              <Route path="/features" element={<LazyFeaturesPage />} />
                              <Route path="/founders-wall" element={<LazyFoundersWallPage />} />
                              <Route path="/full-app-test" element={<LazyUnifiedTestDashboard />} />
                              <Route path="/full-system-test" element={<LazyUnifiedTestDashboard />} />
                              
                              {/* H */}
                              <Route path="/help" element={<LazyHelpPage />} />
                              <Route path="/how-it-works" element={<LazyHowItWorksPage />} />
                              
                              {/* U */}
                              <Route path="/my-tickets" element={<LazyMyTicketsPage />} />
                              
                              {/* I */}
                              <Route path="/impact" element={<LazyImpactPage />} />
                              <Route path="/install" element={<LazyInstallPage />} />
                              <Route path="/investors" element={<LazyInvestorPage />} />
                              <Route path="/ios-blocked" element={<LazyIOSBlockedPage />} />
                              
                              {/* P - New Pitch & Partnership routes */}
                              <Route path="/pitch-deck" element={<LazyPitchDeckPage />} />
                              <Route path="/partnership-framework" element={<LazyPartnershipFrameworkPage />} />
                              
                              {/* K */}
                              <Route path="/knowledge-base" element={<LazyKnowledgeBasePage />} />
                              <Route path="/karma" element={<LazyKarmaDashboardPage />} />
                              
                              {/* L */}
                              <Route path="/learning-hub" element={<LazyLearningHubPage />} />
                              <Route path="/login" element={<LazyLoginPage />} />
                              <Route path="/loyalty" element={<LazyRewardsPage />} />
                              <Route path="/loyalty" element={<LazyLoyaltyPage />} />
                              <Route path="/loyalty-program-guide" element={<LazyLoyaltyProgramGuidePage />} />
                              
                              {/* M */}
                              <Route path="/mansa-ambassadors" element={<LazyMansaAmbassadorsPage />} />
                              <Route path="/ambassador-resources" element={<LazyAmbassadorResourcesPage />} />
                              <Route path="/marketing-materials" element={<LazyMarketingMaterialsPage />} />
                              <Route path="/master-apple-review-test" element={<LazyMasterAppleReviewTestPage />} />
                              <Route path="/media-kit" element={<LazyMediaKitPage />} />
                              <Route path="/mobile-readiness-test" element={<LazyUnifiedTestDashboard />} />
                              <Route path="/my-bookings" element={<LazyCustomerBookingsPage />} />
                              <Route path="/my-profile" element={<LazyUserProfilePage />} />
                              
                              {/* N */}
                              <Route path="/native-features-demo" element={<LazyNativeFeaturesDemo />} />
                              <Route path="/native-features-showcase" element={<LazyNativeFeaturesShowcase />} />
                              <Route path="/network" element={<LazyNetworkPage />} />
                              
                              {/* P */}
                              <Route path="/partner/eatokra" element={<LazyEatOkraPartnershipPage />} />
                              <Route path="/partner-portal" element={<LazyPartnerPortal />} />
                              <Route path="/password-reset" element={<LazyResetPasswordPage />} />
                              <Route path="/payment-success" element={<LazyPaymentSuccessPage />} />
                              <Route path="/listing-success" element={<LazyListingSuccessPage />} />
                              <Route path="/payment-test" element={
                                <IOSProtectedRoute>
                                  <LazyPaymentTestPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/pre-submission-checklist" element={<LazyPreSubmissionChecklistPage />} />
                              <Route path="/privacy" element={<LazyPrivacyPolicyPage />} />
                              <Route path="/profile" element={<LazyProfilePage />} />
                              
                              {/* Q */}
                              <Route path="/qr-test" element={<LazyQRTestPage />} />
                              
                              {/* R */}
                              <Route path="/recommendations" element={<LazyRecommendationsPage />} />
                              <Route path="/referrals" element={<LazyReferralDashboard />} />
                              <Route path="/refresh" element={<LazyRefreshPage />} />
                              <Route path="/reset-password" element={<LazyPasswordResetRequestPage />} />
                              
                              {/* S */}
                              <Route path="/sales-agent" element={<LazySalesAgentSignupPage />} />
                              <Route path="/sales-agent-dashboard" element={<LazySalesAgentDashboardPage />} />
                              <Route path="/sales-agent-guide" element={<LazySalesAgentGuidePage />} />
                              <Route path="/sales-agent-code-of-conduct" element={<LazySalesAgentCodeOfConductPage />} />
                              <Route path="/sales-agent-leaderboard" element={<LazyLeaderboardPage />} />
                              <Route path="/sales-agent-signup" element={<LazySalesAgentSignupPage />} />
                              <Route path="/scanner" element={<LazyQRScannerPage />} />
                              <Route path="/susu-circles" element={<LazySusuCirclesPage />} />
                              <Route path="/stays" element={<LazyVacationRentalsPage />} />
                              <Route path="/stays/list-property" element={<LazyPropertyListingPage />} />
                              <Route path="/stays/host" element={<LazyHostDashboardPage />} />
                              <Route path="/stays/my-bookings" element={<LazyGuestBookingsPage />} />
                              <Route path="/stays/messages" element={<LazyStaysMessagesPage />} />
                              <Route path="/stays/:id" element={<LazyPropertyDetailPage />} />
                              <Route path="/wallet" element={<LazyWalletPage />} />
                              <Route path="/settings" element={<LazyUserSettingsPage />} />
                              <Route path="/workflow-builder" element={<LazyWorkflowBuilderPage />} />
                              <Route path="/ai-agent" element={<LazyAIAgentDashboard />} />
                              <Route path="/share-impact" element={<LazyShareImpactPage />} />
                              <Route path="/signup" element={
                                <IOSProtectedRoute>
                                  <LazySignupPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/signup-test" element={<LazyUnifiedTestDashboard />} />
                              <Route path="/signup/business" element={
                                <IOSProtectedRoute>
                                  <LazyBusinessSignupPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/social-proof" element={<LazySocialProofPage />} />
                              <Route path="/submit-ticket" element={<LazySubmitTicketPage />} />
                              <Route path="/sponsor-dashboard" element={<LazySponsorDashboardPage />} />
                              <Route path="/sponsor-pricing" element={<LazyCorporateSponsorshipPricingPage />} />
                              <Route path="/sponsor-success" element={<LazySponsorSuccessPage />} />
                              <Route path="/subscription" element={
                                <IOSProtectedRoute>
                                  <LazySubscriptionPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/support" element={<LazySupportPage />} />
                              <Route path="/system-test" element={<LazyUnifiedTestDashboard />} />
                              
                              {/* T */}
                              <Route path="/terms" element={<LazyTermsOfServicePage />} />
                              <Route path="/testing-hub" element={<LazyUnifiedTestDashboard />} />
                              <Route path="/testing/signup" element={<LazyUnifiedTestDashboard />} />
                              <Route path="/test-dashboard" element={<LazyUnifiedTestDashboard />} />
                              
                              {/* V */}
                              <Route path="/verify/:certificateNumber" element={<LazyVerifyCertificatePage />} />
                              
                              {/* U */}
                              <Route path="/user-dashboard" element={<LazyUserDashboardPage />} />
                              <Route path="/user-profile" element={<LazyUserProfilePage />} />
                              <Route path="/user-settings" element={<LazyUserSettingsPage />} />
                              
                              {/* W */}
<Route path="/welcome" element={<LazyWelcomePage />} />
                              
                              {/* Patent Document Export */}
                              <Route path="/patent-export" element={<LazyPatentDocumentExport />} />
                              
                              {/* Business Onboarding */}
                              <Route path="/business/onboarding" element={<LazyBusinessOnboardingPage />} />
                              
                              {/* 404 */}
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
                    <ScrollToTop />
                    <AnalyticsTracker />
                  <TooltipProvider>
                  <div className="min-h-screen bg-background" role="application" aria-label="Mansa Musa Marketplace">
                    {/* Skip to main content link for keyboard navigation */}
                    <a href="#main-content" className="skip-link">
                      Skip to main content
                    </a>
                    
                      <div id="main-content" role="main">
                        <FloatingNav />
                        <BusinessProfilePrompt />
                        <OfflineBanner />
                        <GlobalErrorRecovery />
                        <Suspense fallback={<LoadingFallback />}>
                        <Layout>
                          <Routes>
                        {/* Home */}
                        <Route path="/" element={<HomePage />} />
                        
                        {/* A */}
                        <Route path="/about" element={<LazyAboutPage />} />
                        <Route path="/accessibility" element={<LazyAccessibilityPage />} />
                        <Route path="/admin" element={<LazyAdminPage />} />
                        <Route path="/admin-dashboard" element={<LazyAdminDashboardPage />} />
                        <Route path="/admin/commissions" element={<LazyCommissionsPage />} />
                        <Route path="/admin/email-list" element={<LazyAdminEmailListPage />} />
                        <Route path="/admin/fraud-detection" element={<LazyAdminFraudDetectionPage />} />
                        <Route path="/admin/marketing-analytics" element={<LazyMarketingAnalyticsPage />} />
                        <Route path="/admin/marketing-materials" element={<LazyAdminMarketingMaterialsPage />} />
                        <Route path="/admin/sentiment-analysis" element={<LazyAdminSentimentAnalysisPage />} />
<Route path="/admin/sponsors" element={<LazyAdminSponsorsPage />} />
                        <Route path="/admin/sponsors/:id" element={<LazyAdminSponsorDetailPage />} />
                        <Route path="/admin/verification" element={<LazyAdminVerificationPage />} />
                        <Route path="/admin/business-import" element={<LazyAdminBusinessImport />} />
                        <Route path="/admin/sponsor-crm" element={<LazyAdminSponsorCRM />} />
                        <Route path="/admin/emails" element={<LazyAdminEmailAnalyticsPage />} />
                        <Route path="/ai-assistant" element={<LazyAIAssistantPage />} />
                        <Route path="/all-pages" element={<LazyAllPagesDirectory />} />
                        <Route path="/apple-compliance" element={<LazyAppleComplianceTestPage />} />
                        <Route path="/apple-compliance-test" element={<LazyAppleComplianceTestPage />} />
                        <Route path="/app-functionality-test" element={<LazyAppTestPage />} />
                        <Route path="/auth" element={<LazyAuthPage />} />
                        
                        {/* B */}
                        <Route path="/become-a-sales-agent" element={<LazySalesAgentGuidePage />} />
                        <Route path="/blog" element={<LazyBlogPage />} />
                        <Route path="/book/:businessId" element={<LazyBookBusinessPage />} />
                        <Route path="/business-analytics" element={
                          <IOSProtectedRoute>
                            <LazyBusinessAnalyticsPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business-dashboard" element={
                          <IOSProtectedRoute>
                            <LazyDashboardPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business-finances" element={
                          <IOSProtectedRoute>
                            <LazyBusinessFinancesPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business-form" element={
                          <IOSProtectedRoute>
                            <LazyBusinessFormPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business-signup" element={
                          <IOSProtectedRoute>
                            <LazyBusinessSignupPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business/bookings" element={
                          <IOSProtectedRoute>
                            <LazyBusinessBookingsPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business/how-it-works" element={<LazyBusinessHowItWorksPage />} />
                        <Route path="/business/b2b-dashboard" element={<LazyB2BDashboardPage />} />
                        <Route path="/business/register" element={
                          <IOSProtectedRoute>
                            <LazyBusinessSignupPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business/:businessId" element={<LazyBusinessDetailPage />} />
                        <Route path="/business/:businessId/commissions" element={<LazyCommissionReportsPage />} />
                        
                        <Route path="/button-test" element={<LazyButtonTestPage />} />
                        <Route path="/b2b-marketplace" element={<LazyComingSoonPage />} />
                        <Route path="/leads-dashboard" element={<LazyComingSoonPage />} />
                        
                        {/* C */}
                        <Route path="/capacitor-test" element={<LazyCapacitorTestPage />} />
                        <Route path="/challenges" element={<LazyGroupChallengesPage />} />
                        <Route path="/claim-business" element={<LazyClaimBusinessPage />} />
                        <Route path="/coalition" element={<LazyCoalitionPage />} />
                        <Route path="/community" element={<LazyCommunityPage />} />
                        <Route path="/community-finance" element={<LazyCommunityFinancePage />} />
                        <Route path="/community-impact" element={<LazyCommunityImpactPage />} />
                        <Route path="/community-impact-test" element={<LazyUnifiedTestDashboard />} />
                        <Route path="/comprehensive-test" element={<LazyUnifiedTestDashboard />} />
                        <Route path="/contact" element={<LazyContactPage />} />
                        <Route path="/cookies" element={<LazyCookiePolicyPage />} />
                        <Route path="/corporate-dashboard" element={
                          <IOSProtectedRoute>
                            <LazyCorporateDashboardPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/corporate-sponsorship" element={<LazyCorporateSponsorshipPage />} />
                        <Route path="/customer/bookings" element={<LazyCustomerBookingsPage />} />
                        <Route path="/customers" element={<LazyCustomersPage />} />
                        <Route path="/customers/new" element={<LazyNewCustomerPage />} />
                        <Route path="/customers/:customerId" element={<LazyCustomerDetailPage />} />
                        
                        {/* D */}
                        <Route path="/dashboard" element={<LazyUnifiedDashboard />} />
                        <Route path="/developers" element={<LazyComingSoonPage />} />
                        <Route path="/developers/dashboard" element={<LazyComingSoonPage />} />
                        <Route path="/developers/signup" element={<LazyComingSoonPage />} />
                        <Route path="/developers/docs" element={<LazyComingSoonPage />} />
                        <Route path="/developers/pricing" element={<LazyComingSoonPage />} />
                        <Route path="/developers/sdks" element={<LazyComingSoonPage />} />
                        <Route path="/developers/showcase" element={<LazyComingSoonPage />} />
                        <Route path="/directory" element={<LazyDirectoryPage />} />
                        
                        {/* E */}
                        <Route path="/education" element={<LazyEducationPage />} />
                        <Route path="/email-copy" element={<LazyEmailCopyPage />} />
                        <Route path="/email-verified" element={<LazyEmailVerified />} />
                        <Route path="/error" element={<LazyErrorPage />} />
                        
                        {/* F */}
                        <Route path="/faq" element={<LazyFAQPage />} />
                        <Route path="/features" element={<LazyFeaturesPage />} />
                        <Route path="/feature-guide" element={<LazyFeatureGuidePage />} />
                        <Route path="/founders-wall" element={<LazyFoundersWallPage />} />
                        <Route path="/full-app-test" element={<LazyUnifiedTestDashboard />} />
                        <Route path="/full-system-test" element={<LazyUnifiedTestDashboard />} />
                        
                        {/* H */}
                        <Route path="/help" element={<LazyHelpPage />} />
                        <Route path="/how-it-works" element={<LazyHowItWorksPage />} />
                        
                        {/* I */}
                        <Route path="/impact" element={<LazyImpactPage />} />
                        <Route path="/install" element={<LazyInstallPage />} />
                        <Route path="/investors" element={<LazyInvestorPage />} />
                        <Route path="/ios-blocked" element={<LazyIOSBlockedPage />} />
                        
                        {/* K */}
                        <Route path="/karma" element={<LazyKarmaDashboardPage />} />
                        <Route path="/knowledge-base" element={<LazyKnowledgeBasePage />} />
                        
                        {/* L */}
                        <Route path="/learning-hub" element={<LazyLearningHubPage />} />
                        <Route path="/login" element={<LazyLoginPage />} />
                        <Route path="/loyalty" element={<LazyRewardsPage />} />
                        <Route path="/loyalty-program-guide" element={<LazyLoyaltyProgramGuidePage />} />
                        
                        {/* M */}
                        <Route path="/mansa-ambassadors" element={<LazyMansaAmbassadorsPage />} />
                        <Route path="/ambassador-resources" element={<LazyAmbassadorResourcesPage />} />
                        <Route path="/marketing-materials" element={<LazyMarketingMaterialsPage />} />
                        <Route path="/master-apple-review-test" element={<LazyMasterAppleReviewTestPage />} />
                        <Route path="/media-kit" element={<LazyMediaKitPage />} />
                        <Route path="/mobile-readiness-test" element={<LazyUnifiedTestDashboard />} />
                        <Route path="/my-bookings" element={<LazyCustomerBookingsPage />} />
                        <Route path="/my-profile" element={<LazyUserProfilePage />} />
                        <Route path="/my-tickets" element={<LazyMyTicketsPage />} />
                        
                        {/* N */}
                        <Route path="/native-features-demo" element={<LazyNativeFeaturesDemo />} />
                        <Route path="/native-features-showcase" element={<LazyNativeFeaturesShowcase />} />
                        <Route path="/network" element={<LazyNetworkPage />} />
                        
                        {/* P */}
                        <Route path="/partner/eatokra" element={<LazyEatOkraPartnershipPage />} />
                        <Route path="/partner-portal" element={<LazyPartnerPortal />} />
                        <Route path="/partnership-framework" element={<LazyPartnershipFrameworkPage />} />
                        <Route path="/password-reset" element={<LazyResetPasswordPage />} />
                        <Route path="/payment-success" element={<LazyPaymentSuccessPage />} />
                        <Route path="/listing-success" element={<LazyListingSuccessPage />} />
                        <Route path="/payment-test" element={
                          <IOSProtectedRoute>
                            <LazyPaymentTestPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/pitch-deck" element={<LazyPitchDeckPage />} />
                        <Route path="/pre-submission-checklist" element={<LazyPreSubmissionChecklistPage />} />
                        <Route path="/privacy" element={<LazyPrivacyPolicyPage />} />
                        <Route path="/profile" element={<LazyProfilePage />} />
                        
                        {/* Q */}
                        <Route path="/qr-test" element={<LazyQRTestPage />} />
                        
                        {/* R */}
                        <Route path="/recommendations" element={<LazyRecommendationsPage />} />
                        <Route path="/referrals" element={<LazyReferralDashboard />} />
                        <Route path="/refresh" element={<LazyRefreshPage />} />
                        <Route path="/reset-password" element={<LazyPasswordResetRequestPage />} />
                        
                        {/* S */}
                        <Route path="/sales-agent" element={<LazySalesAgentSignupPage />} />
                        <Route path="/sales-agent-dashboard" element={<LazySalesAgentDashboardPage />} />
                        <Route path="/sales-agent-guide" element={<LazySalesAgentGuidePage />} />
                        <Route path="/sales-agent-code-of-conduct" element={<LazySalesAgentCodeOfConductPage />} />
                        <Route path="/sales-agent-leaderboard" element={<LazyLeaderboardPage />} />
                        <Route path="/sales-agent-signup" element={<LazySalesAgentSignupPage />} />
                        <Route path="/scanner" element={<LazyQRScannerPage />} />
                        <Route path="/susu-circles" element={<LazySusuCirclesPage />} />
                        <Route path="/stays" element={<LazyVacationRentalsPage />} />
                        <Route path="/stays/list-property" element={<LazyPropertyListingPage />} />
                        <Route path="/stays/host" element={<LazyHostDashboardPage />} />
                        <Route path="/stays/my-bookings" element={<LazyGuestBookingsPage />} />
                        <Route path="/stays/messages" element={<LazyStaysMessagesPage />} />
                        <Route path="/stays/:id" element={<LazyPropertyDetailPage />} />
                        <Route path="/wallet" element={<LazyWalletPage />} />
                        <Route path="/settings" element={<LazyUserSettingsPage />} />
                        <Route path="/share-impact" element={<LazyShareImpactPage />} />
                        <Route path="/signup" element={<LazySignupPage />} />
                        <Route path="/signup-test" element={<LazyUnifiedTestDashboard />} />
                        <Route path="/signup/business" element={
                          <IOSProtectedRoute>
                            <LazyBusinessSignupPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/signup/customer" element={<LazyCustomerSignupPage />} />
                        <Route path="/social-proof" element={<LazySocialProofPage />} />
                        <Route path="/submit-ticket" element={<LazySubmitTicketPage />} />
                        <Route path="/sponsor-dashboard" element={
                          <IOSProtectedRoute>
                            <LazySponsorDashboardPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/sponsor-pricing" element={
                          <IOSProtectedRoute>
                            <LazyCorporateSponsorshipPricingPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/sponsor-success" element={<LazySponsorSuccessPage />} />
                        <Route path="/subscription" element={
                          <IOSProtectedRoute>
                            <LazySubscriptionPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/support" element={<LazySupportPage />} />
                        <Route path="/system-test" element={<LazyUnifiedTestDashboard />} />
                        
                        {/* T */}
                        <Route path="/terms" element={<LazyTermsOfServicePage />} />
                        <Route path="/testing-hub" element={<LazyUnifiedTestDashboard />} />
                        <Route path="/testing/signup" element={<LazyUnifiedTestDashboard />} />
                        <Route path="/test-dashboard" element={<LazyUnifiedTestDashboard />} />
                        
                        {/* U */}
                        <Route path="/user-dashboard" element={<LazyUserDashboardPage />} />
                        <Route path="/user-guide" element={<LazyUserGuidePage />} />
                        <Route path="/user-profile" element={<LazyUserProfilePage />} />
                        <Route path="/user-settings" element={<LazyUserSettingsPage />} />
                        
                        {/* V */}
                        <Route path="/verify/:certificateNumber" element={<LazyVerifyCertificatePage />} />
                        
                        {/* W */}
                        <Route path="/welcome" element={<LazyWelcomePage />} />
                        <Route path="/workflow-builder" element={<LazyWorkflowBuilderPage />} />
                        
                        {/* AI Agent */}
                        <Route path="/ai-agent" element={<LazyAIAgentDashboard />} />
                        
                        {/* Patent Document Export */}
                        <Route path="/patent-export" element={<LazyPatentDocumentExport />} />
                        
                        {/* Business Onboarding */}
                        <Route path="/business/onboarding" element={<LazyBusinessOnboardingPage />} />
                        
                        {/* Admin routes */}
                        <Route path="/admin" element={<LazyAdminPage />} />
                        <Route path="/admin-dashboard" element={<LazyAdminDashboardPage />} />
                        <Route path="/admin/commissions" element={<LazyCommissionsPage />} />
                        <Route path="/admin/email-list" element={<LazyAdminEmailListPage />} />
                        <Route path="/admin/emails" element={<LazyAdminEmailAnalyticsPage />} />
                        <Route path="/admin/fraud-detection" element={<LazyAdminFraudDetectionPage />} />
                        <Route path="/admin/marketing-analytics" element={<LazyMarketingAnalyticsPage />} />
                        <Route path="/admin/marketing-materials" element={<LazyAdminMarketingMaterialsPage />} />
                        <Route path="/admin/sentiment-analysis" element={<LazyAdminSentimentAnalysisPage />} />
                        <Route path="/admin/sponsors" element={<LazyAdminSponsorsPage />} />
                        <Route path="/admin/sponsors/:id" element={<LazyAdminSponsorDetailPage />} />
                        <Route path="/admin/verification" element={<LazyAdminVerificationPage />} />
                        <Route path="/admin/business-import" element={<LazyAdminBusinessImport />} />
                        <Route path="/admin/sponsor-crm" element={<LazyAdminSponsorCRM />} />
                        <Route path="/ai-assistant" element={<LazyAIAssistantPage />} />
                        <Route path="/all-pages" element={<LazyAllPagesDirectory />} />
                        
                        {/* 404 */}
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
        </GuestProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;