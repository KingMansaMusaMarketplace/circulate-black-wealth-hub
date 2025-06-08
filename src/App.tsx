
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth/AuthProvider";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import PerformanceMonitor from "@/components/PerformanceMonitor";

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const HowItWorksPage = lazy(() => import("@/pages/HowItWorksPage"));
const DirectoryPage = lazy(() => import("@/pages/DirectoryPage"));
const BusinessDetailPage = lazy(() => import("@/pages/BusinessDetailPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const BusinessDashboardPage = lazy(() => import("@/pages/BusinessDashboardPage"));
const QRScannerPage = lazy(() => import("@/pages/QRScannerPage"));
const LoyaltyPage = lazy(() => import("@/pages/LoyaltyPage"));
const SalesAgentPage = lazy(() => import("@/pages/SalesAgentPage"));
const CorporateSponsorshipPage = lazy(() => import("@/pages/CorporateSponsorshipPage"));
const CommunityPage = lazy(() => import("@/pages/CommunityPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <PerformanceMonitor />
                <Navbar />
                <main className="flex-grow">
                  <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mansablue"></div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/how-it-works" element={<HowItWorksPage />} />
                      <Route path="/directory" element={<DirectoryPage />} />
                      <Route path="/business/:id" element={<BusinessDetailPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/business-dashboard" element={<BusinessDashboardPage />} />
                      <Route path="/scanner" element={<QRScannerPage />} />
                      <Route path="/loyalty" element={<LoyaltyPage />} />
                      <Route path="/sales-agent" element={<SalesAgentPage />} />
                      <Route path="/sponsorship" element={<CorporateSponsorshipPage />} />
                      <Route path="/community" element={<CommunityPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
