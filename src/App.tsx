
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from '@/components/theme-provider';
import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import BusinessDetailPage from "@/pages/BusinessDetailPage";
import DashboardPage from "@/pages/DashboardPage";
import DirectoryPage from "@/pages/DirectoryPage";
import NotFound from "@/pages/NotFound";
import AboutPage from "@/pages/AboutPage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import ProfilePage from "@/pages/ProfilePage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import NewPasswordPage from "@/pages/NewPasswordPage";
import LoyaltyHistoryPage from "@/pages/LoyaltyHistoryPage";
import BusinessProfilePage from "@/pages/BusinessProfilePage";
import AdminPage from "@/pages/AdminPage";
import QRCodeManagementPage from "@/pages/QRCodeManagementPage";
import QRScannerPage from "@/pages/QRScannerPage";
import { AuthProvider } from "@/contexts/AuthContext";
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="mansa-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/business/:id" element={<BusinessDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/new-password" element={<NewPasswordPage />} />
            <Route path="/loyalty-history" element={<LoyaltyHistoryPage />} />
            <Route path="/business-profile" element={<BusinessProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/qr-management" element={<QRCodeManagementPage />} />
            <Route path="/scan" element={<QRScannerPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
