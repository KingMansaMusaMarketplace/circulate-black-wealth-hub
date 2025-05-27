import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { initAppConfig } from "@/lib/utils/app-config";
import { useEffect } from "react";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CustomerSignupPage from "./pages/CustomerSignupPage";
import BusinessSignupPage from "./pages/BusinessSignupPage";
import SalesAgentSignupPage from "./pages/SalesAgentSignupPage";
import SignupSuccessPage from "./pages/SignupSuccessPage";
import SalesAgentPage from "./pages/SalesAgentPage";
import DashboardPage from "./pages/DashboardPage";
import DirectoryPage from "./pages/DirectoryPage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import BusinessProfilePage from "./pages/BusinessProfilePage";
import ProfilePage from "./pages/ProfilePage";
import LoyaltyPage from "./pages/LoyaltyPage";
import QRCodeManagementPage from "./pages/QRCodeManagementPage";
import SettingsPage from "./pages/SettingsPage";
import SignupTestPage from "./pages/SignupTestPage";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize app configuration
    initAppConfig().then((cleanup) => {
      // Store cleanup function if needed
      if (cleanup) {
        window.addEventListener('beforeunload', cleanup);
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/customer-signup" element={<CustomerSignupPage />} />
              <Route path="/business-signup" element={<BusinessSignupPage />} />
              <Route path="/sales-agent-signup" element={<SalesAgentSignupPage />} />
              <Route path="/signup-success" element={<SignupSuccessPage />} />
              <Route path="/sales-agent" element={<SalesAgentPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/business-profile" element={<BusinessProfilePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/loyalty-history" element={<LoyaltyPage />} />
              <Route path="/qr-code-management" element={<QRCodeManagementPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/signup-test" element={<SignupTestPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
