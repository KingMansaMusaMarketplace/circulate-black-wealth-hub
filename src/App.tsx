
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
import BusinessPage from "./pages/BusinessPage";
import DirectoryPage from "./pages/DirectoryPage";
import MapViewPage from "./pages/MapViewPage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import QRCodeScannerPage from "./pages/QRCodeScannerPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

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
              <Route path="/business/:id" element={<BusinessPage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/map" element={<MapViewPage />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/scanner" element={<QRCodeScannerPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
