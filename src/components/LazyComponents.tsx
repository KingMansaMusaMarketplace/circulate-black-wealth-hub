import { lazy } from 'react';

// Lazy load all page components for better performance
export const LazyAboutPage = lazy(() => import('@/pages/AboutPage'));
export const LazyDirectoryPage = lazy(() => import('@/pages/DirectoryPage'));
export const LazyDashboardPage = lazy(() => import('@/pages/DashboardPage'));
export const LazyLoyaltyPage = lazy(() => import('@/pages/LoyaltyPage'));
export const LazyCommunityImpactPage = lazy(() => import('@/pages/CommunityImpactPage'));
export const LazyCorporateSponsorshipPage = lazy(() => import('@/pages/CorporateSponsorshipPage'));
export const LazyQRScannerPage = lazy(() => import('@/pages/QRScannerPage'));
export const LazyBusinessDetailPage = lazy(() => import('@/pages/BusinessDetailPage'));
export const LazySubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'));
export const LazyStripeTestPage = lazy(() => import('@/pages/StripeTestPage'));
export const LazyProfilePage = lazy(() => import('@/pages/ProfilePage'));
export const LazyMobileReadinessTestPage = lazy(() => import('@/pages/MobileReadinessTestPage'));
export const LazyFullAppTestPage = lazy(() => import('@/pages/FullAppTestPage'));
export const LazyCommunityImpactTestPage = lazy(() => import('@/pages/CommunityImpactTestPage'));
export const LazySignupTestPage = lazy(() => import('@/pages/SignupTestPage'));
export const LazyBusinessSignupPage = lazy(() => import('@/pages/BusinessSignupPage'));
export const LazyIOSBlockedPage = lazy(() => import('@/pages/IOSBlockedPage'));
export const LazyBusinessFormPage = lazy(() => import('@/pages/BusinessFormPage'));
export const LazyLoginPage = lazy(() => import('@/pages/LoginPage'));
export const LazySignupPage = lazy(() => import('@/pages/SignupPage'));
export const LazyPasswordResetRequestPage = lazy(() => import('@/pages/PasswordResetRequestPage'));
export const LazyResetPasswordPage = lazy(() => import('@/pages/ResetPassword'));
export const LazyHowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));
export const LazySystemTestPage = lazy(() => import('@/pages/SystemTestPage'));
export const LazyFullSystemTestPage = lazy(() => import('@/pages/FullSystemTestPage'));
export const LazyAccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));
export const LazyCapacitorTestPage = lazy(() => import('@/pages/CapacitorTestPage'));
export const LazyComprehensiveTestPage = lazy(() => import('@/pages/ComprehensiveTestPage'));
export const LazyFeatureGuidePage = lazy(() => import('@/pages/FeatureGuidePage'));

// Additional lazy loaded pages
export const LazyRewardsPage = lazy(() => import('@/pages/RewardsPage'));
export const LazyBusinessDiscoveryPage = lazy(() => import('@/pages/BusinessDiscoveryPage'));
export const LazySalesAgentSignupPage = lazy(() => import('@/pages/SalesAgentSignupPage'));
export const LazySalesAgentGuidePage = lazy(() => import('@/pages/SalesAgentGuidePage'));
export const LazySalesAgentDashboardPage = lazy(() => import('@/pages/SalesAgentDashboardPage'));
export const LazyBusinessProfilePage = lazy(() => import('@/pages/BusinessProfilePage'));
export const LazyContactPage = lazy(() => import('@/pages/ContactPage'));
export const LazySupportPage = lazy(() => import('@/pages/SupportPage'));
export const LazyTermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
export const LazyPrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
export const LazyCookiePolicyPage = lazy(() => import('@/pages/CookiePolicyPage'));
export const LazyBlogPage = lazy(() => import('@/pages/BlogPage'));
export const LazyHelpPage = lazy(() => import('@/pages/HelpPage'));
export const LazyAllPagesDirectory = lazy(() => import('@/pages/AllPagesDirectory'));

// Media Kit Page
export const LazyMediaKitPage = lazy(() => import('@/pages/MediaKitPage'));
