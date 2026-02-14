import React, { lazy, ComponentType } from 'react';

// Retry wrapper for lazy imports to handle chunk load failures on mobile/slow networks
function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 3
): React.LazyExoticComponent<T> {
  return lazy(() => {
    let attempt = 0;
    const load = (): Promise<{ default: T }> =>
      factory().catch((err) => {
        attempt++;
        if (attempt < retries) {
          // Wait briefly then retry
          return new Promise<{ default: T }>((resolve) =>
            setTimeout(() => resolve(load()), 1000 * attempt)
          );
        }
        // Final attempt failed — force reload if chunk hash changed
        if (err?.message?.includes('Load failed') || err?.message?.includes('Failed to fetch')) {
          window.location.reload();
        }
        throw err;
      });
    return load();
  });
}

// Lazy load all page components with retry for resilience
export const LazyAboutPage = lazyWithRetry(() => import('@/pages/AboutPage'));
export const LazyDirectoryPage = lazyWithRetry(() => import('@/pages/DirectoryPage'));
export const LazyDashboardPage = lazyWithRetry(() => import('@/pages/DashboardPage'));
export const LazyLoyaltyPage = lazyWithRetry(() => import('@/pages/LoyaltyPage'));
export const LazyCommunityImpactPage = lazyWithRetry(() => import('@/pages/CommunityImpactPage'));
export const LazyCorporateSponsorshipPage = lazyWithRetry(() => import('@/pages/CorporateSponsorshipPage'));
export const LazyQRScannerPage = lazyWithRetry(() => import('@/pages/QRScannerPage'));
export const LazyBusinessDetailPage = lazyWithRetry(() => import('@/pages/BusinessDetailPage'));
export const LazySubscriptionPage = lazyWithRetry(() => import('@/pages/SubscriptionPage'));
export const LazyStripeTestPage = lazyWithRetry(() => import('@/pages/StripeTestPage'));
export const LazyProfilePage = lazyWithRetry(() => import('@/pages/ProfilePage'));
export const LazyMobileReadinessTestPage = lazyWithRetry(() => import('@/pages/MobileReadinessTestPage'));
export const LazyFullAppTestPage = lazyWithRetry(() => import('@/pages/FullAppTestPage'));
export const LazyCommunityImpactTestPage = lazyWithRetry(() => import('@/pages/CommunityImpactTestPage'));
export const LazySignupTestPage = lazyWithRetry(() => import('@/pages/SignupTestPage'));
export const LazyBusinessSignupPage = lazyWithRetry(() => import('@/pages/BusinessSignupPage'));
export const LazyIOSBlockedPage = lazyWithRetry(() => import('@/pages/IOSBlockedPage'));
export const LazyBusinessFormPage = lazyWithRetry(() => import('@/pages/BusinessFormPage'));
export const LazyLoginPage = lazyWithRetry(() => import('@/pages/LoginPage'));
export const LazySignupPage = lazyWithRetry(() => import('@/pages/SignupPage'));
export const LazyPasswordResetRequestPage = lazyWithRetry(() => import('@/pages/PasswordResetRequestPage'));
export const LazyResetPasswordPage = lazyWithRetry(() => import('@/pages/ResetPassword'));
export const LazyHowItWorksPage = lazyWithRetry(() => import('@/pages/HowItWorksPage'));
export const LazySystemTestPage = lazyWithRetry(() => import('@/pages/SystemTestPage'));
export const LazyFullSystemTestPage = lazyWithRetry(() => import('@/pages/FullSystemTestPage'));
export const LazyAccessibilityPage = lazyWithRetry(() => import('@/pages/AccessibilityPage'));
export const LazyCapacitorTestPage = lazyWithRetry(() => import('@/pages/CapacitorTestPage'));
export const LazyComprehensiveTestPage = lazyWithRetry(() => import('@/pages/ComprehensiveTestPage'));
export const LazyFeatureGuidePage = lazyWithRetry(() => import('@/pages/FeatureGuidePage'));

// Additional lazy loaded pages
export const LazyRewardsPage = lazyWithRetry(() => import('@/pages/RewardsPage'));
export const LazyBusinessDiscoveryPage = lazyWithRetry(() => import('@/pages/BusinessDiscoveryPage'));
export const LazySalesAgentSignupPage = lazyWithRetry(() => import('@/pages/SalesAgentSignupPage'));
export const LazySalesAgentGuidePage = lazyWithRetry(() => import('@/pages/SalesAgentGuidePage'));
export const LazySalesAgentDashboardPage = lazyWithRetry(() => import('@/pages/SalesAgentDashboardPage'));
export const LazyBusinessProfilePage = lazyWithRetry(() => import('@/pages/BusinessProfilePage'));
export const LazyContactPage = lazyWithRetry(() => import('@/pages/ContactPage'));
export const LazySupportPage = lazyWithRetry(() => import('@/pages/SupportPage'));
export const LazyTermsOfServicePage = lazyWithRetry(() => import('@/pages/TermsOfServicePage'));
export const LazyPrivacyPolicyPage = lazyWithRetry(() => import('@/pages/PrivacyPolicyPage'));
export const LazyCookiePolicyPage = lazyWithRetry(() => import('@/pages/CookiePolicyPage'));
export const LazyBlogPage = lazyWithRetry(() => import('@/pages/BlogPage'));
export const LazyHelpPage = lazyWithRetry(() => import('@/pages/HelpPage'));
export const LazyAllPagesDirectory = lazyWithRetry(() => import('@/pages/AllPagesDirectory'));

// Media Kit Page
export const LazyMediaKitPage = lazyWithRetry(() => import('@/pages/MediaKitPage'));

// Coalition & B2B Pages
export const LazyCoalitionPage = lazyWithRetry(() => import('@/pages/CoalitionPage'));
export const LazyB2BMarketplacePage = lazyWithRetry(() => import('@/pages/B2BMarketplacePage'));
export const LazyB2BDashboardPage = lazyWithRetry(() => import('@/pages/business/B2BDashboardPage'));
