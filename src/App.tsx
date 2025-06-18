
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import AuthProvider from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import LoadingSpinner from "@/components/ui/loading-spinner";
import HomePage from "./pages/HomePage";
import DirectoryPage from "./pages/DirectoryPage";
import BusinessPage from "./pages/BusinessPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import QRScannerPage from "./pages/QRScannerPage";
import LoyaltyPage from "./pages/LoyaltyPage";
import BusinessFormPage from "./pages/BusinessFormPage";
import CorporateSponsorshipPage from "./pages/CorporateSponsorshipPage";
import CommunityImpactPage from "./pages/CommunityImpactPage";
import SystemTestPage from "./pages/SystemTestPage";
import MobileTestPage from "./pages/MobileTestPage";
import ComprehensiveTestPage from "./pages/ComprehensiveTestPage";
import SignupTestPage from "./pages/SignupTestPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import PasswordResetRequestPage from "./pages/PasswordResetRequestPage";
import MobileReadinessTestPage from "./pages/MobileReadinessTestPage";
import SalesAgentPage from "./pages/SalesAgentPage";
import CommunityPage from "./pages/CommunityPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";

// Add new lazy import
const AppTestPage = lazy(() => import("./pages/AppTestPage"));

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscriptionProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/directory" element={<DirectoryPage />} />
                    <Route path="/business/:id" element={<BusinessPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/scanner" element={<QRScannerPage />} />
                    <Route path="/loyalty" element={<LoyaltyPage />} />
                    <Route path="/business-form" element={<BusinessFormPage />} />
                    <Route path="/sponsorship" element={<CorporateSponsorshipPage />} />
                    <Route path="/corporate-sponsorship" element={<CorporateSponsorshipPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/community-impact" element={<CommunityImpactPage />} />
                    <Route path="/case-studies" element={<CaseStudiesPage />} />
                    <Route path="/sales-agent" element={<SalesAgentPage />} />
                    <Route path="/system-test" element={<SystemTestPage />} />
                    <Route path="/mobile-test" element={<MobileTestPage />} />
                    <Route path="/comprehensive-test" element={<ComprehensiveTestPage />} />
                    <Route path="/signup-test" element={<SignupTestPage />} />
                    <Route path="/new-password" element={<NewPasswordPage />} />
                    <Route path="/password-reset-request" element={<PasswordResetRequestPage />} />
                    <Route path="/mobile-readiness-test" element={<MobileReadinessTestPage />} />
                    
                    {/* Add new test route */}
                    <Route 
                      path="/app-test" 
                      element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <AppTestPage />
                        </Suspense>
                      } 
                    />
                  </Routes>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
