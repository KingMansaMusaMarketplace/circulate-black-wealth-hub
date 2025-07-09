import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { HelmetProvider } from 'react-helmet-async';
import "./index.css";
import App from "./App";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BusinessSignupPage from "./pages/BusinessSignupPage";
import ProfilePage from "./pages/ProfilePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import BusinessProfilePage from "./pages/BusinessProfilePage";
import SalesAgentSignupPage from "./pages/SalesAgentSignupPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import TestingPage from "./pages/TestingPage";
import AccessibilityPage from "@/pages/AccessibilityPage";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const router = (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/business-signup" element={<BusinessSignupPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/subscription" element={<SubscriptionPage />} />
    <Route path="/business-profile" element={<BusinessProfilePage />} />
    <Route path="/sales-agent-signup" element={<SalesAgentSignupPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/testing" element={<TestingPage />} />
    <Route path="/accessibility" element={<AccessibilityPage />} />
  </Routes>
);

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscriptionProvider>
            <BrowserRouter>
              <TooltipProvider>
                <div className="min-h-screen bg-background" role="application" aria-label="Mansa Musa Marketplace">
                  {/* Skip to main content link for keyboard navigation */}
                  <a href="#main-content" className="skip-link">
                    Skip to main content
                  </a>
                  
                  <div id="main-content" role="main">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/business-signup" element={<BusinessSignupPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/subscription" element={<SubscriptionPage />} />
                      <Route path="/business-profile" element={<BusinessProfilePage />} />
                      <Route path="/sales-agent-signup" element={<SalesAgentSignupPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/testing" element={<TestingPage />} />
                      <Route path="/accessibility" element={<AccessibilityPage />} />
                    </Routes>
                  </div>
                </div>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </BrowserRouter>
          </SubscriptionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
