
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import DirectoryPage from "./pages/DirectoryPage";
import BusinessDetailPage from "./pages/BusinessDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import BusinessProfilePage from "./pages/BusinessProfilePage";
import LoyaltyHistoryPage from "./pages/LoyaltyHistoryPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import TeamContactPage from "./pages/TeamContactPage";
import QRCodeManagementPage from "./pages/QRCodeManagementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/business/:id" element={<BusinessDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/new-password" element={<NewPasswordPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/business-profile" element={<BusinessProfilePage />} />
            <Route path="/loyalty-history" element={<LoyaltyHistoryPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/team-contact" element={<TeamContactPage />} />
            <Route path="/qr-code-management" element={<QRCodeManagementPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
