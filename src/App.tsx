import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isCapacitorPlatform } from '@/utils/capacitor-platform-check';
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
import RequireAdmin from '@/components/auth/RequireAdmin';
const ShoppingAssistantChat = lazy(() => import("@/components/ai/ShoppingAssistantChat"));
import { HelmetProvider } from 'react-helmet-async';
// initializeCapacitorPlugins is dynamically imported below to avoid dual static+dynamic import
const CookieConsentBanner = lazy(() => import("@/components/legal/CookieConsentBanner"));
import Layout from "@/components/Layout";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { RouteErrorBoundary } from "@/components/error-boundary/RouteErrorBoundary";
import IOSProtectedRoute from "@/components/routing/IOSProtectedRoute";
import FloatingNav from "@/components/navigation/FloatingNav";
import BusinessProfilePrompt from "@/components/business/BusinessProfilePrompt";
import { GlobalErrorRecovery } from "@/components/error-recovery/GlobalErrorRecovery";
import { OfflineBanner } from "@/components/network/OfflineBanner";
import { SubscriptionAlertBanner } from "@/components/subscription/SubscriptionAlertBanner";
import ScrollToTop from "@/components/ScrollToTop";
import { useCartSync } from "@/hooks/useCartSync";
import "./index.css";

// Wraps React.lazy so that when a code-split chunk 404s (typical after a
// redeploy while the user still has the old index.html cached), we force
// one reload to fetch the new chunk manifest instead of showing a blank
// error page. sessionStorage guards against reload loops.
function lazyWithReload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (err: any) {
      const msg = String(err?.message || err);
      const isChunkError =
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        msg.includes('error loading dynamically imported module');
      if (isChunkError && typeof window !== 'undefined') {
        const key = '__chunk_reload_attempted__';
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          window.location.reload();
          // Return a stub while the reload happens
          return { default: (() => null) as unknown as T };
        }
      }
      throw err;
    }
  });
}

// Critical components (loaded immediately)
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
const RedeemBetaCodePage = lazy(() => import('./pages/RedeemBetaCodePage'));

// Import lazy components
import {
  LazyAboutPage,
  LazyDirectoryPage,
  LazyBlackOwnedIndexPage,
  LazyBlackOwnedCityPage,
  LazyBlackOwnedCategoryPage,
  LazyCityCategoryLandingPage,
  LazyCorporateSponsorshipPage,
  LazyQRScannerPage,
  LazyBusinessDetailPage,
  LazySubscriptionPage,
  LazyBusinessSignupPage,
  LazyBusinessFormPage,
  LazyLoginPage,
  LazySignupPage,
  LazyPasswordResetRequestPage,
  LazyResetPasswordPage,
  LazyHowItWorksPage,
  LazyAccessibilityPage,
} from './components/LazyComponents';
import OAuthConsentPage from './pages/OAuthConsentPage';
const LazyConnectPage = lazy(() => import('./pages/ConnectPage'));
const LazyConnectChatGPTPage = lazy(() => import('./pages/ConnectChatGPTPage'));

// Media Kit page
const LazyMediaKitPage = lazy(() => import('@/pages/MediaKitPage'));
const LazyPressPage = lazy(() => import('@/pages/PressPage'));
const LazyWhy1325Page = lazy(() => import('@/pages/Why1325Page'));
const LazyHeyGenStudioPage = lazy(() => import('@/pages/admin/HeyGenStudioPage'));

// Mansa Stays — Yearly Leasing
const LazyLeaseSearchPage = lazy(() => import('@/pages/stays/LeaseSearchPage'));
const LazyLeaseListingDetailPage = lazy(() => import('@/pages/stays/LeaseListingDetailPage'));
const LazyHostCreateLeasePage = lazy(() => import('@/pages/stays/HostCreateLeasePage'));
const LazyHostEditLeasePage = lazy(() => import('@/pages/stays/HostEditLeasePage'));
const LazyHostBulkUploadLeasesPage = lazy(() => import('@/pages/stays/HostBulkUploadLeasesPage'));
const LazyTenantConfirmLeasePage = lazy(() => import('@/pages/stays/TenantConfirmLeasePage'));
const LazyHostLeaseDashboardPage = lazy(() => import('@/pages/stays/HostLeaseDashboardPage'));
const LazyLeaseCategoryLandingPage = lazy(() => import('@/pages/stays/LeaseCategoryLandingPage'));

// Coalition & B2B pages
const LazyCoalitionPage = lazy(() => import('@/pages/CoalitionPage'));
const LazyB2BMarketplacePage = lazy(() => import('@/pages/B2BMarketplacePage'));
const LazyB2BDashboardPage = lazy(() => import('@/pages/business/B2BDashboardPage'));
import { B2BProGate } from '@/components/business/B2BProGate';
const LazyNoirLandingPage = lazy(() => import('@/pages/NoirLandingPage'));
const LazyDriverApplyPage = lazy(() => import('@/pages/noir/DriverApplyPage'));
const LazyNoirHotelPartnersPage = lazy(() => import('@/pages/noir/HotelPartnersPage'));
const LazyNoirBookRidePage = lazy(() => import('@/pages/noir/BookRidePage'));
const LazyNoirConciergePortalPage = lazy(() => import('@/pages/noir/ConciergePortalPage'));
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

const LazyEmailVerified = lazy(() => import('@/pages/EmailVerified'));
const LazyIOSBlockedPage = lazy(() => import('@/pages/IOSBlockedPage'));
const LazyUnsubscribePage = lazy(() => import('@/pages/UnsubscribePage'));
const LazyFeatureGuidePage = lazy(() => import('@/pages/FeatureGuidePage'));
const LazyErrorPage = lazy(() => import('@/pages/ErrorPage'));
const LazyCorporateDashboardPage = lazy(() => import('@/pages/CorporateDashboardPage'));
const LazyPaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage'));
const LazyFoundingSuccessPage = lazy(() => import('@/pages/FoundingSuccessPage'));
const LazyListingSuccessPage = lazy(() => import('@/pages/ListingSuccessPage'));
const LazyCorporateSponsorshipPricingPage = lazy(() => import('@/pages/CorporateSponsorshipPricingPage'));
const LazyPricingPage = lazy(() => import('@/pages/PricingPage'));

const LazySponsorSuccessPage = lazy(() => import('@/pages/SponsorSuccessPage'));
const LazyAdminSponsorsPage = lazy(() => import('@/pages/AdminSponsorsPage'));
const LazyAdminSponsorDetailPage = lazy(() => import('@/pages/AdminSponsorDetailPage'));
const LazyRefreshPage = lazy(() => import('@/pages/RefreshPage'));
const LazySponsorLandingPage = lazy(() => import('@/pages/SponsorLandingPage'));
const LazyJobsPage = lazy(() => import('@/pages/JobsPage'));
const LazyPostJobPage = lazy(() => import('@/pages/PostJobPage'));
const LazyAdminJobsPage = lazy(() => import('@/pages/AdminJobsPage'));
const LazyFeatureDiscoveryPage = lazy(() => import('@/components/onboarding/FeatureDiscovery'));
const LazyCustomersPage = lazy(() => import('@/pages/CustomersPage'));
const LazyCustomerDetailPage = lazy(() => import('@/pages/CustomerDetailPage'));
const LazyNewCustomerPage = lazy(() => import('@/pages/NewCustomerPage'));
const LazyPreSubmissionChecklistPage = lazy(() => import('@/pages/PreSubmissionChecklistPage'));
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

const LazyNetworkPage = lazy(() => import('@/pages/NetworkPage'));
const LazyLeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const LazyImpactPage = lazy(() => import('@/pages/ImpactPage'));
const LazyCommissionsPage = lazy(() => import('@/pages/admin/CommissionsPage'));
const LazyCommissionReportsPage = lazy(() => import('@/pages/business/CommissionReportsPage'));
const LazyBusinessHowItWorksPage = lazy(() => import('@/pages/business/HowItWorksPage'));
const LazyEmailCopyPage = lazy(() => import('@/pages/EmailCopyPage'));
const LazyKaylaGTMKitPage = lazy(() => import('@/pages/KaylaGTMKitPage'));
const LazyWhatKaylaDoesPage = lazy(() => import('@/pages/WhatKaylaDoesPage'));
const LazyKaylaTeamPage = lazy(() => import('@/pages/KaylaTeamPage'));
const LazyAIAssistantPage = lazy(() => import('@/pages/AIAssistantPage'));
const LazyMarketingStudio = lazy(() => import('@/pages/MarketingStudio'));
const LazyAdminFraudDetectionPage = lazy(() => import('@/pages/AdminFraudDetectionPage'));
const LazyAdminSentimentAnalysisPage = lazy(() => import('@/pages/AdminSentimentAnalysisPage'));
const LazyLearningHubPage = lazy(() => import('@/pages/LearningHubPage'));
const LazyLoyaltyProgramGuidePage = lazy(() => import('@/pages/LoyaltyProgramGuidePage'));

const LazyAdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const LazyAIWorkforceDashboard = lazy(() => import('@/pages/admin/AIWorkforceDashboard'));
const LazyBusinessReviewQueue = lazy(() => import('@/pages/admin/BusinessReviewQueue'));
const LazyAdminVerificationPage = lazy(() => import('@/pages/AdminVerificationPage'));
const LazyAdminSubmissionsQueue = lazy(() => import('@/pages/admin/SubmissionsQueue'));
const LazyAdminEmailListPage = lazy(() => import('@/pages/AdminEmailListPage'));
const LazyAdminEmailAnalyticsPage = lazy(() => import('@/pages/admin/EmailAnalyticsPage'));
const LazyQRCodeGeneratorPage = lazy(() => import('@/pages/QRCodeGeneratorPage'));
const LazyQRCodeManagementPage = lazy(() => import('@/pages/QRCodeManagementPage'));
const LazyVerifyCertificatePage = lazy(() => import('@/pages/VerifyCertificatePage'));
const LazyFeaturedPlacementPage = lazy(() => import('@/pages/business/FeaturedPlacementPage'));
const LazyInstitutionalAPIPage = lazy(() => import('@/pages/InstitutionalAPIPage'));
const LazyAPIDocsPage = lazy(() => import('@/pages/developer/APIDocsPage'));
const LazyAdminPlatformRevenuePage = lazyWithReload(() => import('@/pages/admin/PlatformRevenuePage'));
const LazyAdminAPIClientsPage = lazy(() => import('@/pages/admin/APIClientsPage'));
const LazySEODashboard = lazy(() => import('@/pages/admin/SEODashboard'));
const LazyBacklinksDashboard = lazy(() => import('@/pages/admin/BacklinksDashboard'));
const LazyFunnelAnalyticsPage = lazy(() => import('@/pages/admin/FunnelAnalyticsPage'));

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
const LazyAdminOutreachCRM = lazy(() => import('@/pages/AdminOutreachCRM'));
const LazyAdminInvestorPortalPage = lazy(() => import('@/pages/AdminInvestorPortalPage'));

// Investor & Ambassador pages
const LazyInvestorPage = lazy(() => import('@/pages/InvestorPage'));
const LazyInvestorPortalPage = lazy(() => import('@/pages/InvestorPortalPage'));
const LazyMansaAmbassadorsPage = lazy(() => import('@/pages/MansaAmbassadorsPage'));
const LazyPitchDeckPage = lazy(() => import('@/pages/PitchDeckPage'));
const LazyPartnershipFrameworkPage = lazy(() => import('@/pages/PartnershipFrameworkPage'));
const LazyPartnerPortal = lazy(() => import('@/pages/PartnerPortal'));
const LazyWidgetDemoPage = lazy(() => import('@/pages/WidgetDemoPage'));

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
const LazyWishlistPage = lazy(() => import('@/pages/WishlistPage'));
const LazyCoHostAcceptPage = lazy(() => import('@/pages/CoHostAcceptPage'));
const LazyExperiencesPage = lazy(() => import('@/pages/stays/ExperiencesPage'));
const LazyCreateExperiencePage = lazy(() => import('@/pages/stays/CreateExperiencePage'));
const LazyJoinStaysBetaPage = lazy(() => import('@/pages/stays/JoinStaysBetaPage'));
const LazyBecomeHostPage = lazy(() => import('@/pages/stays/BecomeHostPage'));
const LazyHostingAgreementPage = lazy(() => import('@/pages/legal/HostingAgreementPage'));
const LazyTenantTermsPage = lazy(() => import('@/pages/legal/TenantTermsPage'));
const LazyPhotoConsentPage = lazy(() => import('@/pages/legal/PhotoConsentPage'));
const LazyBlackOwnedHotelsPage = lazy(() => import('@/pages/landing/BlackOwnedHotelsPage'));
const LazyBlackOwnedResortsPage = lazy(() => import('@/pages/landing/BlackOwnedResortsPage'));
const LazyBlackOwnedVacationRentalsPage = lazy(() => import('@/pages/landing/BlackOwnedVacationRentalsPage'));
const LazyBlackOwnedHotelsByStatePage = lazy(() => import('@/pages/landing/BlackOwnedHotelsByStatePage'));
const LazySoulFoodNearMePage = lazy(() => import('@/pages/landing/SoulFoodNearMePage'));

// Founder's Wall
const LazyFoundersWallPage = lazy(() => import('@/pages/FoundersWallPage'));
const LazyAmbassadorResourcesPage = lazy(() => import('@/pages/AmbassadorResourcesPage'));
const LazySalesAgentCodeOfConductPage = lazy(() => import('@/pages/SalesAgentCodeOfConductPage'));

// User profile pages

const LazyUserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
const LazyUserSettingsPage = lazy(() => import('@/pages/UserSettingsPage'));
const LazyBusinessAnalyticsPage = lazy(() => import('@/components/analytics/BusinessAnalyticsDashboard'));
const LazyCustomerBookingsPage = lazy(() => import('@/pages/CustomerBookingsPage'));
const LazyBusinessBookingsPage = lazy(() => import('@/pages/BusinessBookingsPage'));
const LazyBookBusinessPage = lazy(() => import('@/pages/BookBusinessPage'));
const LazyBusinessFinancesPage = lazy(() => import('@/pages/BusinessFinancesPage'));
const LazyBusinessRecordsPage = lazy(() => import('@/pages/business/BusinessRecordsPage'));
const LazyEnterpriseLocationsPage = lazy(() => import('@/pages/business/EnterpriseLocationsPage'));
const LazyEnterpriseWhiteLabelPage = lazy(() => import('@/pages/business/EnterpriseWhiteLabelPage'));
const LazyEnterpriseSeatsPage = lazy(() => import('@/pages/business/EnterpriseSeatsPage'));
const LazyEnterpriseConciergePage = lazy(() => import('@/pages/business/EnterpriseConciergePage'));
import { EnterpriseGate } from '@/components/business/EnterpriseGate';

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

// Merch Store pages (hidden temporarily)
// const LazyMerchStorePage = lazy(() => import('@/pages/MerchStorePage'));
// const LazyProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));

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
      networkMode: 'always', // Don't pause queries based on network status
    },
    mutations: {
      networkMode: 'always', // Don't pause mutations — prevents "Queue is paused" indicator
    },
  },
});

function App() {
  // CRITICAL: Start with appReady=true to NEVER show loading screen
  // This ensures iOS app launches immediately without any spinner
  const [appReady, setAppReady] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRecoverableError, setHasRecoverableError] = useState(false);

  // Sync Shopify cart state
  useCartSync();

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
      import('@/utils/capacitor-plugins').then(({ initializeCapacitorPlugins }) => {
        initializeCapacitorPlugins()
          .then(() => console.log('[APP] Plugins ready'))
          .catch(err => {
            console.error('[APP] Plugin error (non-fatal):', err);
          });
      }).catch(() => {});
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

  // appReady starts true — this branch is a defensive fallback only
  if (!appReady) {
    console.log('[APP INIT] Not ready, showing loader');
    return <LoadingFallback message="" />;
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
                    <div className="min-h-screen bg-background" role="application" aria-label="1325.AI">
                      {/* Skip to main content link for keyboard navigation */}
                      <a href="#main-content" className="skip-link">
                        Skip to main content
                      </a>
                      
                      <div id="main-content" role="main">
                        <FloatingNav />
                        <BusinessProfilePrompt />
                        <OfflineBanner />
                        <SubscriptionAlertBanner />
                        <GlobalErrorRecovery />
                        <Suspense fallback={<LoadingFallback />}>
                          <Layout>
                            <Routes>
                              {/* All routes wrapped with error boundary */}
                              <Route errorElement={<RouteErrorBoundary />}>
                              {/* Home — Directory is the landing page */}
                              <Route path="/" element={<LazyDirectoryPage />} />
                              <Route path="/about-1325" element={<HomePage />} />
                              <Route path="/connect" element={<LazyConnectPage />} />
                              <Route path="/connect-chatgpt" element={<LazyConnectChatGPTPage />} />
                              
                              {/* A */}
                              <Route path="/about" element={<LazyAboutPage />} />
                              <Route path="/accessibility" element={<LazyAccessibilityPage />} />
                              {/* Admin - consolidated to single dashboard */}
                              <Route path="/admin" element={<RequireAdmin><LazyAdminDashboardPage /></RequireAdmin>} />
                              <Route path="/admin-dashboard" element={<RequireAdmin><LazyAdminDashboardPage /></RequireAdmin>} />
                              <Route path="/admin/commissions" element={<RequireAdmin><LazyCommissionsPage /></RequireAdmin>} />
                              <Route path="/admin/heygen" element={<RequireAdmin><LazyHeyGenStudioPage /></RequireAdmin>} />
                              <Route path="/admin/email-list" element={<RequireAdmin><LazyAdminEmailListPage /></RequireAdmin>} />
                              <Route path="/admin/emails" element={<RequireAdmin><LazyAdminEmailAnalyticsPage /></RequireAdmin>} />
                              <Route path="/admin/fraud-detection" element={<RequireAdmin><LazyAdminFraudDetectionPage /></RequireAdmin>} />
                              <Route path="/admin/marketing-analytics" element={<RequireAdmin><LazyMarketingAnalyticsPage /></RequireAdmin>} />
                              <Route path="/admin/marketing-materials" element={<RequireAdmin><LazyAdminMarketingMaterialsPage /></RequireAdmin>} />
                              <Route path="/admin/sentiment-analysis" element={<RequireAdmin><LazyAdminSentimentAnalysisPage /></RequireAdmin>} />
                              <Route path="/admin/sponsors" element={<RequireAdmin><LazyAdminSponsorsPage /></RequireAdmin>} />
                              <Route path="/admin/sponsors/:id" element={<RequireAdmin><LazyAdminSponsorDetailPage /></RequireAdmin>} />
                              <Route path="/admin/verification" element={<RequireAdmin><LazyAdminVerificationPage /></RequireAdmin>} />
                              <Route path="/admin/submissions" element={<RequireAdmin><LazyAdminSubmissionsQueue /></RequireAdmin>} />
                              <Route path="/admin/business-import" element={<RequireAdmin><LazyAdminBusinessImport /></RequireAdmin>} />
                              <Route path="/admin/sponsor-crm" element={<RequireAdmin><LazyAdminSponsorCRM /></RequireAdmin>} />
                              <Route path="/admin/outreach" element={<RequireAdmin><LazyAdminOutreachCRM /></RequireAdmin>} />
                              <Route path="/admin/investor-portal" element={<RequireAdmin><LazyAdminInvestorPortalPage /></RequireAdmin>} />
                              <Route path="/admin/ai-workforce" element={<RequireAdmin><LazyAIWorkforceDashboard /></RequireAdmin>} />
                              <Route path="/admin/business-review" element={<RequireAdmin><LazyBusinessReviewQueue /></RequireAdmin>} />
                              <Route path="/admin/revenue" element={<RequireAdmin><LazyAdminPlatformRevenuePage /></RequireAdmin>} />
                              <Route path="/admin/api-clients" element={<RequireAdmin><LazyAdminAPIClientsPage /></RequireAdmin>} />
                              <Route path="/admin/seo" element={<RequireAdmin><LazySEODashboard /></RequireAdmin>} />
                              <Route path="/admin/backlinks" element={<RequireAdmin><LazyBacklinksDashboard /></RequireAdmin>} />
                              <Route path="/admin/funnel" element={<RequireAdmin><LazyFunnelAnalyticsPage /></RequireAdmin>} />
                              <Route path="/business/featured-placement" element={<LazyFeaturedPlacementPage />} />
                              <Route path="/institutional-api" element={<LazyInstitutionalAPIPage />} />
                              <Route path="/developer/api-docs" element={<LazyAPIDocsPage />} />
                              <Route path="/ai-assistant" element={<LazyAIAssistantPage />} />
                              <Route path="/marketing-studio" element={<LazyMarketingStudio />} />
                              <Route path="/all-pages" element={<LazyAllPagesDirectory />} />
                              {/* Test routes removed from production */}
                             <Route path="/auth" element={<LazyLoginPage />} />
                             <Route path="/redeem-beta" element={<RedeemBetaCodePage />} />
                             <Route path="/beta-redeem" element={<RedeemBetaCodePage />} />
                              
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
                                  <LazyUnifiedDashboard />
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
                              <Route path="/business/records" element={
                                <IOSProtectedRoute>
                                  <LazyBusinessRecordsPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business/how-it-works" element={<LazyBusinessHowItWorksPage />} />
                              <Route path="/business/b2b-dashboard" element={<B2BProGate><LazyB2BDashboardPage /></B2BProGate>} />
                              <Route path="/business/locations" element={
                                <IOSProtectedRoute>
                                  <EnterpriseGate featureName="Multi-location management"><LazyEnterpriseLocationsPage /></EnterpriseGate>
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business/white-label" element={
                                <IOSProtectedRoute>
                                  <EnterpriseGate featureName="White-label settings"><LazyEnterpriseWhiteLabelPage /></EnterpriseGate>
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business/enterprise/seats" element={
                                <IOSProtectedRoute>
                                  <EnterpriseGate featureName="Seat management"><LazyEnterpriseSeatsPage /></EnterpriseGate>
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business/enterprise/concierge" element={
                                <IOSProtectedRoute>
                                  <EnterpriseGate featureName="Enterprise Concierge"><LazyEnterpriseConciergePage /></EnterpriseGate>
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business/register" element={
                                <IOSProtectedRoute>
                                  <LazyBusinessSignupPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business/profile" element={
                                <IOSProtectedRoute>
                                  <LazyBusinessProfilePage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/business/:businessId" element={<LazyBusinessDetailPage />} />
                              <Route path="/business/:businessId/commissions" element={<LazyCommissionReportsPage />} />
                              {/* /button-test removed */}
                              <Route path="/b2b-marketplace" element={<LazyComingSoonPage />} />
                              <Route path="/leads-dashboard" element={<LazyComingSoonPage />} />
                              
                              {/* C */}
                              {/* /capacitor-test removed */}
                              <Route path="/challenges" element={<LazyGroupChallengesPage />} />
                              <Route path="/claim-business" element={<LazyClaimBusinessPage />} />
                              <Route path="/coalition" element={<LazyCoalitionPage />} />
                              <Route path="/community" element={<LazyCommunityPage />} />
                              <Route path="/community" element={<LazyCommunityPage />} />
                              <Route path="/community-finance" element={<LazyCommunityFinancePage />} />
                              <Route path="/community-impact" element={<LazyImpactPage />} />
                              <Route path="/economic-impact" element={<LazyImpactPage />} />
                              {/* test routes removed */}
                              <Route path="/contact" element={<LazyContactPage />} />
                              <Route path="/cookies" element={<LazyCookiePolicyPage />} />
                              <Route path="/corporate-dashboard" element={<LazyCorporateDashboardPage />} />
                              <Route path="/corporate-sponsorship" element={
                                <IOSProtectedRoute>
                                  <LazyCorporateSponsorshipPage />
                                </IOSProtectedRoute>
                              } />
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
                              <Route path="/directory" element={<Navigate to="/" replace />} />
                              <Route path="/black-owned" element={<LazyBlackOwnedIndexPage />} />
                              <Route path="/black-owned-business-directory" element={<LazyBlackOwnedIndexPage />} />
                              <Route path="/minority-business-marketplace" element={<LazyBlackOwnedIndexPage />} />
                              <Route path="/black-owned/city/:slug" element={<LazyBlackOwnedCityPage />} />
                              <Route path="/black-owned/category/:slug" element={<LazyBlackOwnedCategoryPage />} />
                              <Route path="/black-owned/in/:citySlug/:categoryGroup" element={<LazyCityCategoryLandingPage />} />
                              <Route path="/jobs" element={<LazyJobsPage />} />
                              <Route path="/jobs/post" element={<LazyPostJobPage />} />
                              <Route path="/admin/jobs" element={<RequireAdmin><LazyAdminJobsPage /></RequireAdmin>} />
                              
                              {/* E */}
                              <Route path="/education" element={<LazyEducationPage />} />
                              <Route path="/email-copy" element={<LazyEmailCopyPage />} />
                              <Route path="/email-verified" element={<LazyEmailVerified />} />
                              
                              {/* K - Kayla GTM */}
                              <Route path="/kayla-gtm-kit" element={<LazyKaylaGTMKitPage />} />
                              <Route path="/kayla-announcement" element={<LazyKaylaGTMKitPage />} />
                              <Route path="/kayla-onboarding-sequence" element={<LazyKaylaGTMKitPage />} />
                              <Route path="/what-kayla-does" element={<LazyWhatKaylaDoesPage />} />
                              <Route path="/kayla/team" element={<LazyKaylaTeamPage />} />
                              <Route path="/error" element={<LazyErrorPage />} />
                              
                              {/* F */}
                              <Route path="/faq" element={<LazyFAQPage />} />
                              <Route path="/features" element={<LazyFeaturesPage />} />
                              <Route path="/founders-wall" element={<LazyFoundersWallPage />} />
                              {/* test routes removed */}
                              
                              {/* H */}
                              <Route path="/help" element={<LazyHelpPage />} />
                              <Route path="/how-it-works" element={<LazyHowItWorksPage />} />
                              
                              {/* U */}
                              <Route path="/my-tickets" element={<LazyMyTicketsPage />} />
                              
                              {/* I */}
                              <Route path="/impact" element={<LazyImpactPage />} />
                              <Route path="/install" element={<LazyInstallPage />} />
                              <Route path="/investors" element={<LazyInvestorPage />} />
                              <Route path="/investor-portal" element={<LazyInvestorPortalPage />} />
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
                              <Route path="/.lovable/oauth/consent" element={<OAuthConsentPage />} />
                              <Route path="/loyalty" element={<LazyRewardsPage />} />
                              <Route path="/rewards" element={<LazyRewardsPage />} />
                              <Route path="/loyalty-program-guide" element={<LazyLoyaltyProgramGuidePage />} />
                              
                              {/* M */}
                              <Route path="/mansa-ambassadors" element={<LazyMansaAmbassadorsPage />} />
                              <Route path="/ambassador-resources" element={<LazyAmbassadorResourcesPage />} />
                              <Route path="/marketing-materials" element={<LazyMarketingMaterialsPage />} />
                              {/* test routes removed */}
                              <Route path="/media-kit" element={<LazyMediaKitPage />} />
                              <Route path="/press" element={<LazyPressPage />} />
                              <Route path="/why-1325" element={<LazyWhy1325Page />} />
                              <Route path="/my-bookings" element={<LazyCustomerBookingsPage />} />
                              <Route path="/my-profile" element={<LazyUserProfilePage />} />
                              
                              {/* N */}
                              <Route path="/noir" element={<LazyNoirLandingPage />} />
                              <Route path="/noir/book" element={<LazyNoirBookRidePage />} />
                              <Route path="/noir/hotels" element={<LazyNoirHotelPartnersPage />} />
                              <Route path="/noir/concierge" element={<LazyNoirConciergePortalPage />} />
                              <Route path="/noir/drive/apply" element={<LazyDriverApplyPage />} />
                              <Route path="/native-features-demo" element={<LazyNativeFeaturesDemo />} />
                              <Route path="/native-features-showcase" element={<LazyNativeFeaturesShowcase />} />
                              <Route path="/network" element={<LazyNetworkPage />} />
                              
                              {/* P */}
                              <Route path="/partner/eatokra" element={<LazyEatOkraPartnershipPage />} />
                              <Route path="/partner-portal" element={<LazyPartnerPortal />} />
                              <Route path="/widget-demo" element={<LazyWidgetDemoPage />} />
                              <Route path="/password-reset" element={<LazyPasswordResetRequestPage />} />
                              <Route path="/payment-success" element={
                                <IOSProtectedRoute>
                                  <LazyPaymentSuccessPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/founding-success" element={
                                <IOSProtectedRoute>
                                  <LazyFoundingSuccessPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/pricing" element={
                                <IOSProtectedRoute>
                                  <LazyPricingPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/listing-success" element={
                                <IOSProtectedRoute>
                                  <LazyListingSuccessPage />
                                </IOSProtectedRoute>
                              } />
                              {/* /payment-test, /qr-test removed */}
                              <Route path="/qr-code-generator" element={<LazyQRCodeGeneratorPage />} />
                              <Route path="/qr-code-management" element={<LazyQRCodeGeneratorPage />} />
                              <Route path="/pre-submission-checklist" element={<LazyPreSubmissionChecklistPage />} />
                              <Route path="/privacy" element={<LazyPrivacyPolicyPage />} />
                              <Route path="/profile" element={<LazyUserProfilePage />} />
                              
                              {/* R */}
                              <Route path="/recommendations" element={<LazyRecommendationsPage />} />
                              <Route path="/referrals" element={<LazyReferralDashboard />} />
                              <Route path="/refresh" element={<LazyRefreshPage />} />
                              <Route path="/reset-password" element={<LazyResetPasswordPage />} />
                              
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
                              <Route path="/stays/favorites" element={<LazyWishlistPage />} />
                              <Route path="/stays/cohost-accept" element={<LazyCoHostAcceptPage />} />
                              <Route path="/stays/experiences" element={<LazyExperiencesPage />} />
                              <Route path="/stays/experiences/new" element={<LazyCreateExperiencePage />} />
                              <Route path="/stays/lease" element={<LazyLeaseSearchPage />} />
                              <Route path="/stays/lease/apartments" element={<LazyLeaseCategoryLandingPage />} />
                              <Route path="/stays/lease/houses" element={<LazyLeaseCategoryLandingPage />} />
                              <Route path="/stays/lease/condos" element={<LazyLeaseCategoryLandingPage />} />
                              <Route path="/stays/lease/lofts" element={<LazyLeaseCategoryLandingPage />} />
                              <Route path="/stays/lease/townhouses" element={<LazyLeaseCategoryLandingPage />} />
                              <Route path="/stays/lease/office-space" element={<LazyLeaseCategoryLandingPage />} />
                              <Route path="/stays/lease/warehouses" element={<LazyLeaseCategoryLandingPage />} />
                              <Route path="/stays/lease/chicago" element={<LazyLeaseCategoryLandingPage />} />
                              <Route path="/stays/lease/atlanta" element={<LazyLeaseCategoryLandingPage />} />
                              <Route path="/stays/lease/:city/:category" element={<LazyLeaseCategoryLandingPage />} />
                              <Route path="/stays/lease/:id" element={<LazyLeaseListingDetailPage />} />
                             <Route path="/stays/host/lease/new" element={<LazyHostCreateLeasePage />} />
                             <Route path="/stays/host/lease/edit/:id" element={<LazyHostEditLeasePage />} />
                             <Route path="/stays/host/lease/bulk-upload" element={<LazyHostBulkUploadLeasesPage />} />
                             <Route path="/stays/host/lease/dashboard" element={<LazyHostLeaseDashboardPage />} />
                              <Route path="/stays/tenant/confirm-lease/:token" element={<LazyTenantConfirmLeasePage />} />
                              <Route path="/stays/join-beta" element={<LazyJoinStaysBetaPage />} />
                              <Route path="/stays/become-a-host" element={<LazyBecomeHostPage />} />
                              <Route path="/legal/hosting-agreement" element={<LazyHostingAgreementPage />} />
                              <Route path="/legal/tenant-terms" element={<LazyTenantTermsPage />} />
                              <Route path="/legal/photo-consent" element={<LazyPhotoConsentPage />} />
                              <Route path="/stays/black-owned-hotels" element={<LazyBlackOwnedHotelsPage />} />
                              <Route path="/stays/black-owned-resorts" element={<LazyBlackOwnedResortsPage />} />
                              <Route path="/stays/black-owned-vacation-rentals" element={<LazyBlackOwnedVacationRentalsPage />} />
                              <Route path="/stays/black-owned-hotels/:stateSlug" element={<LazyBlackOwnedHotelsByStatePage />} />
                              <Route path="/directory/soul-food-restaurants-near-me" element={<LazySoulFoodNearMePage />} />
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
                              {/* /signup-test removed */}
                              <Route path="/signup/business" element={
                                <IOSProtectedRoute>
                                  <LazyBusinessSignupPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/social-proof" element={<LazySocialProofPage />} />
                              <Route path="/submit-ticket" element={<LazySubmitTicketPage />} />
                              <Route path="/sponsor-dashboard" element={
                                <IOSProtectedRoute>
                                  <LazyCorporateDashboardPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/sponsor-pricing" element={
                                <IOSProtectedRoute>
                                  <LazyCorporateSponsorshipPricingPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/sponsor-success" element={
                                <IOSProtectedRoute>
                                  <LazySponsorSuccessPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/sponsor/:slug" element={
                                <IOSProtectedRoute>
                                  <LazySponsorLandingPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/subscription" element={
                                <IOSProtectedRoute>
                                  <LazySubscriptionPage />
                                </IOSProtectedRoute>
                              } />
                              <Route path="/support" element={<LazySupportPage />} />
                              {/* test routes removed */}
                              
                              {/* T */}
                              <Route path="/terms" element={<LazyTermsOfServicePage />} />
                              
                              {/* V */}
                              <Route path="/verify/:certificateNumber" element={<LazyVerifyCertificatePage />} />
                              
                              {/* U */}
                              <Route path="/user-dashboard" element={<LazyUnifiedDashboard />} />
                              <Route path="/user-profile" element={<LazyUserProfilePage />} />
                              <Route path="/user-settings" element={<LazyUserSettingsPage />} />
                              <Route path="/unsubscribe" element={<LazyUnsubscribePage />} />
                              
                              {/* W */}
<Route path="/welcome" element={<LazyWelcomePage />} />
                              
                              {/* Patent Document Export */}
                              <Route path="/patent-export" element={<LazyPatentDocumentExport />} />
                              
                              {/* Merch Store (hidden temporarily - shows Coming Soon) */}
                              <Route path="/merch" element={<LazyComingSoonPage />} />
                              <Route path="/merch/:handle" element={<LazyComingSoonPage />} />
                              
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
                    <NativeFeaturesOnboarding />
                    <Suspense fallback={null}><ShoppingAssistantChat /></Suspense>
                    <Toaster />
                    <Sonner />
                  </TooltipProvider>
                  </HashRouter>
                ) : (
                  <BrowserRouter>
                    <ScrollToTop />
                    <AnalyticsTracker />
                  <TooltipProvider>
                  <div className="min-h-screen bg-background" role="application" aria-label="1325.AI">
                    {/* Skip to main content link for keyboard navigation */}
                    <a href="#main-content" className="skip-link">
                      Skip to main content
                    </a>
                    
                      <div id="main-content" role="main">
                        <FloatingNav />
                        <BusinessProfilePrompt />
                        <OfflineBanner />
                        <SubscriptionAlertBanner />
                        <GlobalErrorRecovery />
                        <Suspense fallback={<LoadingFallback />}>
                        <Layout>
                          <Routes>
                        {/* Home — Directory is the landing page */}
                        <Route path="/" element={<LazyDirectoryPage />} />
                        <Route path="/about-1325" element={<HomePage />} />
                        
                        {/* A */}
                        <Route path="/about" element={<LazyAboutPage />} />
                        <Route path="/accessibility" element={<LazyAccessibilityPage />} />
                        <Route path="/admin" element={<RequireAdmin><LazyAdminDashboardPage /></RequireAdmin>} />
                        <Route path="/admin-dashboard" element={<RequireAdmin><LazyAdminDashboardPage /></RequireAdmin>} />
                        <Route path="/admin/commissions" element={<RequireAdmin><LazyCommissionsPage /></RequireAdmin>} />
                        <Route path="/admin/heygen" element={<RequireAdmin><LazyHeyGenStudioPage /></RequireAdmin>} />
                        <Route path="/admin/email-list" element={<RequireAdmin><LazyAdminEmailListPage /></RequireAdmin>} />
                        <Route path="/admin/fraud-detection" element={<RequireAdmin><LazyAdminFraudDetectionPage /></RequireAdmin>} />
                        <Route path="/admin/marketing-analytics" element={<RequireAdmin><LazyMarketingAnalyticsPage /></RequireAdmin>} />
                        <Route path="/admin/marketing-materials" element={<RequireAdmin><LazyAdminMarketingMaterialsPage /></RequireAdmin>} />
                        <Route path="/admin/sentiment-analysis" element={<RequireAdmin><LazyAdminSentimentAnalysisPage /></RequireAdmin>} />
                        <Route path="/admin/sponsors" element={<RequireAdmin><LazyAdminSponsorsPage /></RequireAdmin>} />
                        <Route path="/admin/sponsors/:id" element={<RequireAdmin><LazyAdminSponsorDetailPage /></RequireAdmin>} />
                        <Route path="/admin/verification" element={<RequireAdmin><LazyAdminVerificationPage /></RequireAdmin>} />
                        <Route path="/admin/business-import" element={<RequireAdmin><LazyAdminBusinessImport /></RequireAdmin>} />
                        <Route path="/admin/sponsor-crm" element={<RequireAdmin><LazyAdminSponsorCRM /></RequireAdmin>} />
                        <Route path="/admin/outreach" element={<RequireAdmin><LazyAdminOutreachCRM /></RequireAdmin>} />
                        <Route path="/admin/investor-portal" element={<RequireAdmin><LazyAdminInvestorPortalPage /></RequireAdmin>} />
                        <Route path="/admin/ai-workforce" element={<RequireAdmin><LazyAIWorkforceDashboard /></RequireAdmin>} />
                        <Route path="/admin/business-review" element={<RequireAdmin><LazyBusinessReviewQueue /></RequireAdmin>} />
                        <Route path="/admin/submissions" element={<RequireAdmin><LazyAdminSubmissionsQueue /></RequireAdmin>} />
                        <Route path="/admin/emails" element={<RequireAdmin><LazyAdminEmailAnalyticsPage /></RequireAdmin>} />
                        <Route path="/admin/revenue" element={<RequireAdmin><LazyAdminPlatformRevenuePage /></RequireAdmin>} />
                        <Route path="/admin/api-clients" element={<RequireAdmin><LazyAdminAPIClientsPage /></RequireAdmin>} />
                        <Route path="/admin/funnel" element={<RequireAdmin><LazyFunnelAnalyticsPage /></RequireAdmin>} />
                        <Route path="/admin/seo" element={<RequireAdmin><LazySEODashboard /></RequireAdmin>} />
                        <Route path="/admin/backlinks" element={<RequireAdmin><LazyBacklinksDashboard /></RequireAdmin>} />
                        <Route path="/ai-assistant" element={<LazyAIAssistantPage />} />
                        <Route path="/marketing-studio" element={<LazyMarketingStudio />} />
                        <Route path="/all-pages" element={<LazyAllPagesDirectory />} />
                        {/* Test routes removed from production — use /all-pages (admin only) */}
                        <Route path="/auth" element={<LazyLoginPage />} />
                        
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
                            <LazyUnifiedDashboard />
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
                        <Route path="/business/records" element={
                          <IOSProtectedRoute>
                            <LazyBusinessRecordsPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business/how-it-works" element={<LazyBusinessHowItWorksPage />} />
                        <Route path="/business/b2b-dashboard" element={<B2BProGate><LazyB2BDashboardPage /></B2BProGate>} />
                        <Route path="/business/locations" element={
                          <IOSProtectedRoute>
                            <EnterpriseGate featureName="Multi-location management"><LazyEnterpriseLocationsPage /></EnterpriseGate>
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business/white-label" element={
                          <IOSProtectedRoute>
                            <EnterpriseGate featureName="White-label settings"><LazyEnterpriseWhiteLabelPage /></EnterpriseGate>
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business/enterprise/seats" element={
                          <IOSProtectedRoute>
                            <EnterpriseGate featureName="Seat management"><LazyEnterpriseSeatsPage /></EnterpriseGate>
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business/enterprise/concierge" element={
                          <IOSProtectedRoute>
                            <EnterpriseGate featureName="Enterprise Concierge"><LazyEnterpriseConciergePage /></EnterpriseGate>
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business/register" element={
                          <IOSProtectedRoute>
                            <LazyBusinessSignupPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/business/:businessId" element={<LazyBusinessDetailPage />} />
                        <Route path="/business/:businessId/commissions" element={<LazyCommissionReportsPage />} />
                        
                        {/* /button-test removed */}
                        <Route path="/b2b-marketplace" element={<LazyComingSoonPage />} />
                        <Route path="/leads-dashboard" element={<LazyComingSoonPage />} />
                        
                        {/* C */}
                        {/* /capacitor-test removed */}
                        <Route path="/challenges" element={<LazyGroupChallengesPage />} />
                        <Route path="/claim-business" element={<LazyClaimBusinessPage />} />
                        <Route path="/coalition" element={<LazyCoalitionPage />} />
                        <Route path="/community" element={<LazyCommunityPage />} />
                        <Route path="/community-finance" element={<LazyCommunityFinancePage />} />
                        <Route path="/community-impact" element={<LazyImpactPage />} />
                        <Route path="/economic-impact" element={<LazyImpactPage />} />
                        {/* /community-impact-test, /comprehensive-test removed */}
                        <Route path="/contact" element={<LazyContactPage />} />
                        <Route path="/cookies" element={<LazyCookiePolicyPage />} />
                        <Route path="/corporate-dashboard" element={
                          <IOSProtectedRoute>
                            <LazyCorporateDashboardPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/corporate-sponsorship" element={
                          <IOSProtectedRoute>
                            <LazyCorporateSponsorshipPage />
                          </IOSProtectedRoute>
                        } />
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
                        <Route path="/black-owned" element={<LazyBlackOwnedIndexPage />} />
                        <Route path="/black-owned-business-directory" element={<LazyBlackOwnedIndexPage />} />
                        <Route path="/minority-business-marketplace" element={<LazyBlackOwnedIndexPage />} />
                        <Route path="/black-owned/city/:slug" element={<LazyBlackOwnedCityPage />} />
                        <Route path="/black-owned/category/:slug" element={<LazyBlackOwnedCategoryPage />} />
                        <Route path="/black-owned/in/:citySlug/:categoryGroup" element={<LazyCityCategoryLandingPage />} />
                        <Route path="/jobs" element={<LazyJobsPage />} />
                        <Route path="/jobs/post" element={<LazyPostJobPage />} />
                        <Route path="/admin/jobs" element={<RequireAdmin><LazyAdminJobsPage /></RequireAdmin>} />
                        
                        {/* E */}
                        <Route path="/education" element={<LazyEducationPage />} />
                        <Route path="/email-copy" element={<LazyEmailCopyPage />} />
                        <Route path="/email-verified" element={<LazyEmailVerified />} />
                        <Route path="/kayla-gtm-kit" element={<LazyKaylaGTMKitPage />} />
                        <Route path="/kayla-announcement" element={<LazyKaylaGTMKitPage />} />
                        <Route path="/kayla-onboarding-sequence" element={<LazyKaylaGTMKitPage />} />
                        <Route path="/what-kayla-does" element={<LazyWhatKaylaDoesPage />} />
                        <Route path="/kayla/team" element={<LazyKaylaTeamPage />} />
                        <Route path="/error" element={<LazyErrorPage />} />
                        
                        {/* F */}
                        <Route path="/faq" element={<LazyFAQPage />} />
                        <Route path="/features" element={<LazyFeaturesPage />} />
                        <Route path="/feature-guide" element={<LazyFeatureGuidePage />} />
                        <Route path="/founders-wall" element={<LazyFoundersWallPage />} />
                        {/* /full-app-test, /full-system-test removed */}
                        
                        {/* H */}
                        <Route path="/help" element={<LazyHelpPage />} />
                        <Route path="/how-it-works" element={<LazyHowItWorksPage />} />
                        
                        {/* I */}
                        <Route path="/impact" element={<LazyImpactPage />} />
                        <Route path="/install" element={<LazyInstallPage />} />
                        <Route path="/investors" element={<LazyInvestorPage />} />
                        <Route path="/investor-portal" element={<LazyInvestorPortalPage />} />
                        <Route path="/ios-blocked" element={<LazyIOSBlockedPage />} />
                        
                        {/* K */}
                        <Route path="/karma" element={<LazyKarmaDashboardPage />} />
                        <Route path="/knowledge-base" element={<LazyKnowledgeBasePage />} />
                        
                        {/* L */}
                        <Route path="/learning-hub" element={<LazyLearningHubPage />} />
                        <Route path="/login" element={<LazyLoginPage />} />
                        <Route path="/.lovable/oauth/consent" element={<OAuthConsentPage />} />
                        <Route path="/loyalty" element={<LazyRewardsPage />} />
                        <Route path="/loyalty-program-guide" element={<LazyLoyaltyProgramGuidePage />} />
                        
                        {/* M */}
                        <Route path="/mansa-ambassadors" element={<LazyMansaAmbassadorsPage />} />
                        <Route path="/ambassador-resources" element={<LazyAmbassadorResourcesPage />} />
                        <Route path="/marketing-materials" element={<LazyMarketingMaterialsPage />} />
                        {/* /master-apple-review-test removed */}
                        <Route path="/media-kit" element={<LazyMediaKitPage />} />
                        <Route path="/press" element={<LazyPressPage />} />
                        <Route path="/why-1325" element={<LazyWhy1325Page />} />
                        {/* /mobile-readiness-test removed */}
                        <Route path="/my-bookings" element={<LazyCustomerBookingsPage />} />
                        <Route path="/my-profile" element={<LazyUserProfilePage />} />
                        <Route path="/my-tickets" element={<LazyMyTicketsPage />} />
                        
                        {/* N */}
                        <Route path="/noir" element={<LazyNoirLandingPage />} />
                        <Route path="/noir/book" element={<LazyNoirBookRidePage />} />
                        <Route path="/noir/hotels" element={<LazyNoirHotelPartnersPage />} />
                        <Route path="/noir/concierge" element={<LazyNoirConciergePortalPage />} />
                        <Route path="/noir/drive/apply" element={<LazyDriverApplyPage />} />
                        <Route path="/native-features-demo" element={<LazyNativeFeaturesDemo />} />
                        <Route path="/native-features-showcase" element={<LazyNativeFeaturesShowcase />} />
                        <Route path="/network" element={<LazyNetworkPage />} />
                        
                        {/* P */}
                        <Route path="/partner/eatokra" element={<LazyEatOkraPartnershipPage />} />
                        <Route path="/partner-portal" element={<LazyPartnerPortal />} />
                        <Route path="/widget-demo" element={<LazyWidgetDemoPage />} />
                        <Route path="/partnership-framework" element={<LazyPartnershipFrameworkPage />} />
                        <Route path="/password-reset" element={<LazyPasswordResetRequestPage />} />
                        <Route path="/payment-success" element={
                          <IOSProtectedRoute>
                            <LazyPaymentSuccessPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/founding-success" element={
                          <IOSProtectedRoute>
                            <LazyFoundingSuccessPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/pricing" element={
                          <IOSProtectedRoute>
                            <LazyPricingPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/listing-success" element={
                          <IOSProtectedRoute>
                            <LazyListingSuccessPage />
                          </IOSProtectedRoute>
                        } />
                        {/* /payment-test removed */}
                        <Route path="/pitch-deck" element={<LazyPitchDeckPage />} />
                        <Route path="/pre-submission-checklist" element={<LazyPreSubmissionChecklistPage />} />
                        <Route path="/privacy" element={<LazyPrivacyPolicyPage />} />
                        <Route path="/profile" element={<LazyUserProfilePage />} />
                        
                        {/* Q */}
                        {/* /qr-test removed */}
                        <Route path="/qr-code-generator" element={<LazyQRCodeGeneratorPage />} />
                        <Route path="/qr-code-management" element={<LazyQRCodeGeneratorPage />} />
                        
                        {/* R */}
                        <Route path="/recommendations" element={<LazyRecommendationsPage />} />
                        <Route path="/referrals" element={<LazyReferralDashboard />} />
                        <Route path="/refresh" element={<LazyRefreshPage />} />
                        <Route path="/reset-password" element={<LazyResetPasswordPage />} />
                        
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
                        <Route path="/stays/favorites" element={<LazyWishlistPage />} />
                        <Route path="/stays/cohost-accept" element={<LazyCoHostAcceptPage />} />
                        <Route path="/stays/experiences" element={<LazyExperiencesPage />} />
                        <Route path="/stays/experiences/new" element={<LazyCreateExperiencePage />} />
                        <Route path="/stays/lease" element={<LazyLeaseSearchPage />} />
                        <Route path="/stays/lease/apartments" element={<LazyLeaseCategoryLandingPage />} />
                        <Route path="/stays/lease/houses" element={<LazyLeaseCategoryLandingPage />} />
                        <Route path="/stays/lease/condos" element={<LazyLeaseCategoryLandingPage />} />
                        <Route path="/stays/lease/lofts" element={<LazyLeaseCategoryLandingPage />} />
                        <Route path="/stays/lease/townhouses" element={<LazyLeaseCategoryLandingPage />} />
                        <Route path="/stays/lease/office-space" element={<LazyLeaseCategoryLandingPage />} />
                        <Route path="/stays/lease/warehouses" element={<LazyLeaseCategoryLandingPage />} />
                        <Route path="/stays/lease/chicago" element={<LazyLeaseCategoryLandingPage />} />
                        <Route path="/stays/lease/atlanta" element={<LazyLeaseCategoryLandingPage />} />
                        <Route path="/stays/lease/:city/:category" element={<LazyLeaseCategoryLandingPage />} />
                        <Route path="/stays/lease/:id" element={<LazyLeaseListingDetailPage />} />
                       <Route path="/stays/host/lease/new" element={<LazyHostCreateLeasePage />} />
                       <Route path="/stays/host/lease/edit/:id" element={<LazyHostEditLeasePage />} />
                       <Route path="/stays/host/lease/bulk-upload" element={<LazyHostBulkUploadLeasesPage />} />
                       <Route path="/stays/host/lease/dashboard" element={<LazyHostLeaseDashboardPage />} />
                        <Route path="/stays/tenant/confirm-lease/:token" element={<LazyTenantConfirmLeasePage />} />
                        <Route path="/stays/join-beta" element={<LazyJoinStaysBetaPage />} />
                        <Route path="/stays/black-owned-hotels" element={<LazyBlackOwnedHotelsPage />} />
                        <Route path="/stays/black-owned-resorts" element={<LazyBlackOwnedResortsPage />} />
                        <Route path="/stays/black-owned-vacation-rentals" element={<LazyBlackOwnedVacationRentalsPage />} />
                        <Route path="/stays/black-owned-hotels/:stateSlug" element={<LazyBlackOwnedHotelsByStatePage />} />
                        <Route path="/directory/soul-food-restaurants-near-me" element={<LazySoulFoodNearMePage />} />
                        <Route path="/stays/:id" element={<LazyPropertyDetailPage />} />
                        <Route path="/wallet" element={<LazyWalletPage />} />
                        <Route path="/settings" element={<LazyUserSettingsPage />} />
                        <Route path="/share-impact" element={<LazyShareImpactPage />} />
                        <Route path="/signup" element={<LazySignupPage />} />
                        {/* /signup-test removed */}
                        <Route path="/signup/business" element={
                          <IOSProtectedRoute>
                            <LazyBusinessSignupPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/signup/customer" element={<LazySignupPage />} />
                        <Route path="/social-proof" element={<LazySocialProofPage />} />
                        <Route path="/submit-ticket" element={<LazySubmitTicketPage />} />
                        <Route path="/sponsor-dashboard" element={
                          <IOSProtectedRoute>
                            <LazyCorporateDashboardPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/sponsor-pricing" element={
                          <IOSProtectedRoute>
                            <LazyCorporateSponsorshipPricingPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/sponsor-success" element={
                          <IOSProtectedRoute>
                            <LazySponsorSuccessPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/sponsor/:slug" element={
                          <IOSProtectedRoute>
                            <LazySponsorLandingPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/subscription" element={
                          <IOSProtectedRoute>
                            <LazySubscriptionPage />
                          </IOSProtectedRoute>
                        } />
                        <Route path="/support" element={<LazySupportPage />} />
                        {/* /system-test, /testing-hub, /testing/signup, /test-dashboard removed */}
                        
                        {/* T */}
                        <Route path="/terms" element={<LazyTermsOfServicePage />} />
                        
                        {/* U */}
                        <Route path="/user-dashboard" element={<LazyUnifiedDashboard />} />
                        <Route path="/user-guide" element={<LazyUserGuidePage />} />
                        <Route path="/user-profile" element={<LazyUserProfilePage />} />
                        <Route path="/user-settings" element={<LazyUserSettingsPage />} />
                        <Route path="/unsubscribe" element={<LazyUnsubscribePage />} />
                        
                        {/* V */}
                        <Route path="/verify/:certificateNumber" element={<LazyVerifyCertificatePage />} />
                        
                        {/* W */}
                        <Route path="/welcome" element={<LazyWelcomePage />} />
                        <Route path="/workflow-builder" element={<LazyWorkflowBuilderPage />} />

                        {/* Dev / Test (single consolidated dashboard) */}
                        <Route path="/dev/test" element={<LazyUnifiedTestDashboard />} />
                        
                        {/* AI Agent */}
                        <Route path="/ai-agent" element={<LazyAIAgentDashboard />} />
                        
                        {/* Patent Document Export */}
                        <Route path="/patent-export" element={<LazyPatentDocumentExport />} />
                        
                        {/* Merch Store (hidden temporarily - shows Coming Soon) */}
                        <Route path="/merch" element={<LazyComingSoonPage />} />
                        <Route path="/merch/:handle" element={<LazyComingSoonPage />} />
                        
                        {/* Business Onboarding */}
                        <Route path="/business/onboarding" element={<LazyBusinessOnboardingPage />} />
                        
                        {/* Admin routes */}
                        <Route path="/admin" element={<RequireAdmin><LazyAdminDashboardPage /></RequireAdmin>} />
                        <Route path="/admin-dashboard" element={<RequireAdmin><LazyAdminDashboardPage /></RequireAdmin>} />
                        <Route path="/admin/commissions" element={<RequireAdmin><LazyCommissionsPage /></RequireAdmin>} />
                        <Route path="/admin/email-list" element={<RequireAdmin><LazyAdminEmailListPage /></RequireAdmin>} />
                        <Route path="/admin/emails" element={<RequireAdmin><LazyAdminEmailAnalyticsPage /></RequireAdmin>} />
                        <Route path="/admin/fraud-detection" element={<RequireAdmin><LazyAdminFraudDetectionPage /></RequireAdmin>} />
                        <Route path="/admin/marketing-analytics" element={<RequireAdmin><LazyMarketingAnalyticsPage /></RequireAdmin>} />
                        <Route path="/admin/marketing-materials" element={<RequireAdmin><LazyAdminMarketingMaterialsPage /></RequireAdmin>} />
                        <Route path="/admin/sentiment-analysis" element={<RequireAdmin><LazyAdminSentimentAnalysisPage /></RequireAdmin>} />
                        <Route path="/admin/sponsors" element={<RequireAdmin><LazyAdminSponsorsPage /></RequireAdmin>} />
                        <Route path="/admin/sponsors/:id" element={<RequireAdmin><LazyAdminSponsorDetailPage /></RequireAdmin>} />
                        <Route path="/admin/verification" element={<RequireAdmin><LazyAdminVerificationPage /></RequireAdmin>} />
                        <Route path="/admin/business-import" element={<RequireAdmin><LazyAdminBusinessImport /></RequireAdmin>} />
                        <Route path="/admin/sponsor-crm" element={<RequireAdmin><LazyAdminSponsorCRM /></RequireAdmin>} />
                        <Route path="/admin/outreach" element={<RequireAdmin><LazyAdminOutreachCRM /></RequireAdmin>} />
                        <Route path="/admin/investor-portal" element={<RequireAdmin><LazyAdminInvestorPortalPage /></RequireAdmin>} />
                        <Route path="/admin/ai-workforce" element={<RequireAdmin><LazyAIWorkforceDashboard /></RequireAdmin>} />
                        <Route path="/admin/business-review" element={<RequireAdmin><LazyBusinessReviewQueue /></RequireAdmin>} />
                        <Route path="/admin/submissions" element={<RequireAdmin><LazyAdminSubmissionsQueue /></RequireAdmin>} />
                        <Route path="/admin/heygen" element={<RequireAdmin><LazyHeyGenStudioPage /></RequireAdmin>} />
                        <Route path="/admin/revenue" element={<RequireAdmin><LazyAdminPlatformRevenuePage /></RequireAdmin>} />
                        <Route path="/admin/api-clients" element={<RequireAdmin><LazyAdminAPIClientsPage /></RequireAdmin>} />
                        <Route path="/admin/funnel" element={<RequireAdmin><LazyFunnelAnalyticsPage /></RequireAdmin>} />
                        <Route path="/admin/seo" element={<RequireAdmin><LazySEODashboard /></RequireAdmin>} />
                        <Route path="/admin/backlinks" element={<RequireAdmin><LazyBacklinksDashboard /></RequireAdmin>} />
                        <Route path="/ai-assistant" element={<LazyAIAssistantPage />} />
                        <Route path="/marketing-studio" element={<LazyMarketingStudio />} />
                        <Route path="/all-pages" element={<LazyAllPagesDirectory />} />
                        <Route path="/investor-portal" element={<LazyInvestorPortalPage />} />
                        
                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Layout>
                    </Suspense>
                  </div>
                </div>
                <NativeFeaturesOnboarding />
                <Suspense fallback={null}><ShoppingAssistantChat /></Suspense>
                <Toaster />
                <Sonner />
                <Suspense fallback={null}><CookieConsentBanner /></Suspense>
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