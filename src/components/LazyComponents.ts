import { lazy } from 'react';

// Critical components (loaded immediately)
export { default as Navbar } from '@/components/navbar/Navbar';
export { default as Footer } from '@/components/Footer';

// Non-critical components (lazy loaded)
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

// Heavy testing components (lazy loaded)
// export const LazyComprehensiveSystemTestPage = lazy(() => import('@/pages/ComprehensiveSystemTestPage'));
export const LazyMobileReadinessTestPage = lazy(() => import('@/pages/MobileReadinessTestPage'));
export const LazyFullAppTestPage = lazy(() => import('@/pages/FullAppTestPage'));
export const LazyCommunityImpactTestPage = lazy(() => import('@/pages/CommunityImpactTestPage'));
export const LazySignupTestPage = lazy(() => import('@/pages/SignupTestPage'));

// Business components (lazy loaded)
export const LazyBusinessSignupPage = lazy(() => import('@/pages/BusinessSignupPage'));
export const LazyBusinessFormPage = lazy(() => import('@/pages/BusinessFormPage'));

// Authentication components (lazy loaded)
export const LazyAuthPage = lazy(() => import('@/pages/AuthPage'));
export const LazyLoginPage = lazy(() => import('@/pages/LoginPage'));
export const LazySignupPage = lazy(() => import('@/pages/SignupPage'));
export const LazyPasswordResetRequestPage = lazy(() => import('@/pages/PasswordResetRequestPage'));
export const LazyResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));

// How It Works components (lazy loaded)
export const LazyHowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));

// System components (lazy loaded)
export const LazySystemTestPage = lazy(() => import('@/pages/SystemTestPage'));
export const LazyFullSystemTestPage = lazy(() => import('@/pages/FullSystemTestPage'));
export const LazyAccessibilityPage = lazy(() => import('@/pages/AccessibilityPage'));
export const LazyCapacitorTestPage = lazy(() => import('@/pages/CapacitorTestPage'));
export const LazyComprehensiveTestPage = lazy(() => import('@/pages/ComprehensiveTestPage'));

// Heavy UI components (lazy loaded)
export const LazyPerformanceOptimizer = lazy(() => import('@/components/performance/PerformanceOptimizer'));
export const LazyComponentAnalyzer = lazy(() => import('@/components/performance/ComponentAnalyzer'));
export const LazyMemoryProfiler = lazy(() => import('@/components/performance/MemoryProfiler'));

// Business dashboard components (lazy loaded)
export const LazyBusinessDashboard = lazy(() => import('@/components/business/BusinessDashboard'));
// export const LazyBusinessMetrics = lazy(() => import('@/components/business/BusinessMetrics'));

// QR Scanner components (lazy loaded) - using existing components
// export const LazyQRScanner = lazy(() => import('@/components/qr-scanner/QRScanner'));
// export const LazyQRCodeGenerator = lazy(() => import('@/components/qr-scanner/QRCodeGenerator'));

// Map components (lazy loaded) - using existing components  
// export const LazyMapView = lazy(() => import('@/components/map/MapView'));
// export const LazyBusinessMap = lazy(() => import('@/components/map/BusinessMap'));

// Charts and analytics (lazy loaded) - using existing components
// export const LazyAnalyticsCharts = lazy(() => import('@/components/analytics/AnalyticsCharts'));
// export const LazyRevenueChart = lazy(() => import('@/components/charts/RevenueChart'));

// Payment components (lazy loaded)
export const LazyEnhancedPaymentButton = lazy(() => import('@/components/payments/EnhancedPaymentButton'));

// Media components (lazy loaded)
export const LazyVideoPlayer = lazy(() => import('@/components/VideoPlayer'));
export const LazyMediaGallery = lazy(() => import('@/components/AboutPage/MediaGallerySection'));

// Complex forms (lazy loaded)
export const LazyEnhancedSignupForm = lazy(() => import('@/components/auth/forms/EnhancedSignupForm'));
export const LazyBusinessSignupForm = lazy(() => import('@/components/auth/forms/BusinessSignupForm'));
export const LazyContactForm = lazy(() => import('@/components/AboutPage/ContactForm'));