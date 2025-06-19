
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import LoadingSpinner from "@/components/ui/loading-spinner";

console.log('App.tsx: Starting App component');

// Import pages directly to avoid potential import issues
import HomePage from "./pages/HomePage";

// Lazy load other pages to improve initial load
const DirectoryPage = lazy(() => import("./pages/DirectoryPage"));
const BusinessPage = lazy(() => import("./pages/BusinessPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const BusinessSignupPage = lazy(() => import("./pages/BusinessSignupPage"));
const CustomerSignupPage = lazy(() => import("./pages/CustomerSignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const QRScannerPage = lazy(() => import("./pages/QRScannerPage"));
const LoyaltyPage = lazy(() => import("./pages/LoyaltyPage"));
const BusinessFormPage = lazy(() => import("./pages/BusinessFormPage"));
const CorporateSponsorshipPage = lazy(() => import("./pages/CorporateSponsorshipPage"));
const CommunityImpactPage = lazy(() => import("./pages/CommunityImpactPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const EducationPage = lazy(() => import("./pages/EducationPage"));
const MentorshipPage = lazy(() => import("./pages/MentorshipPage"));
const SalesAgentPage = lazy(() => import("./pages/SalesAgentPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AppTestPage = lazy(() => import("./pages/AppTestPage"));

function App() {
  console.log('App.tsx: Rendering App component');
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AboutPage />
            </Suspense>
          } />
          <Route path="/directory" element={
            <Suspense fallback={<LoadingSpinner />}>
              <DirectoryPage />
            </Suspense>
          } />
          <Route path="/business/:id" element={
            <Suspense fallback={<LoadingSpinner />}>
              <BusinessPage />
            </Suspense>
          } />
          <Route path="/login" element={
            <Suspense fallback={<LoadingSpinner />}>
              <LoginPage />
            </Suspense>
          } />
          <Route path="/signup" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SignupPage />
            </Suspense>
          } />
          
          {/* Add specific signup routes */}
          <Route path="/signup/business" element={
            <Suspense fallback={<LoadingSpinner />}>
              <BusinessSignupPage />
            </Suspense>
          } />
          <Route path="/signup/customer" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CustomerSignupPage />
            </Suspense>
          } />
          
          <Route path="/dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardPage />
            </Suspense>
          } />
          <Route path="/scanner" element={
            <Suspense fallback={<LoadingSpinner />}>
              <QRScannerPage />
            </Suspense>
          } />
          <Route path="/loyalty" element={
            <Suspense fallback={<LoadingSpinner />}>
              <LoyaltyPage />
            </Suspense>
          } />
          <Route path="/business-form" element={
            <Suspense fallback={<LoadingSpinner />}>
              <BusinessFormPage />
            </Suspense>
          } />
          <Route path="/sponsorship" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CorporateSponsorshipPage />
            </Suspense>
          } />
          <Route path="/corporate-sponsorship" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CorporateSponsorshipPage />
            </Suspense>
          } />
          <Route path="/subscription" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SubscriptionPage />
            </Suspense>
          } />
          <Route path="/community" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CommunityPage />
            </Suspense>
          } />
          <Route path="/community-impact" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CommunityImpactPage />
            </Suspense>
          } />
          <Route path="/case-studies" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CaseStudiesPage />
            </Suspense>
          } />
          <Route path="/how-it-works" element={
            <Suspense fallback={<LoadingSpinner />}>
              <HowItWorksPage />
            </Suspense>
          } />
          <Route path="/education" element={
            <Suspense fallback={<LoadingSpinner />}>
              <EducationPage />
            </Suspense>
          } />
          <Route path="/mentorship" element={
            <Suspense fallback={<LoadingSpinner />}>
              <MentorshipPage />
            </Suspense>
          } />
          <Route path="/sales-agent" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SalesAgentPage />
            </Suspense>
          } />
          <Route path="/help" element={
            <Suspense fallback={<LoadingSpinner />}>
              <HelpPage />
            </Suspense>
          } />
          <Route path="/blog" element={
            <Suspense fallback={<LoadingSpinner />}>
              <BlogPage />
            </Suspense>
          } />
          <Route path="/privacy" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PrivacyPolicyPage />
            </Suspense>
          } />
          <Route path="/cookies" element={
            <Suspense fallback={<LoadingSpinner />}>
              <CookiePolicyPage />
            </Suspense>
          } />
          <Route path="/terms" element={
            <Suspense fallback={<LoadingSpinner />}>
              <TermsOfServicePage />
            </Suspense>
          } />
          <Route path="/faq" element={
            <Suspense fallback={<LoadingSpinner />}>
              <FAQPage />
            </Suspense>
          } />
          
          {/* Add new test route */}
          <Route 
            path="/app-test" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AppTestPage />
              </Suspense>
            } 
          />
          
          {/* 404 Route - must be last */}
          <Route path="*" element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </div>
    </TooltipProvider>
  );
}

export default App;
