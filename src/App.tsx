
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
import LoyaltyPage from "@/pages/LoyaltyPage";
import BusinessProfilePage from "@/pages/BusinessProfilePage";
import AdminPage from "@/pages/AdminPage";
import QRCodeManagementPage from "@/pages/QRCodeManagementPage";
import QRScannerPage from "@/pages/QRScannerPage";
import RegistrationTestPage from "@/pages/RegistrationTestPage";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="mansa-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/business/:id" element={<BusinessDetailPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/new-password" element={<NewPasswordPage />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/loyalty" element={
              <ProtectedRoute>
                <LoyaltyPage />
              </ProtectedRoute>
            } />
            <Route path="/loyalty-history" element={
              <ProtectedRoute>
                <LoyaltyHistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/scan" element={
              <ProtectedRoute>
                <QRScannerPage />
              </ProtectedRoute>
            } />
            
            {/* Business-only routes */}
            <Route path="/business-profile" element={
              <ProtectedRoute requiredUserType="business">
                <BusinessProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/qr-management" element={
              <ProtectedRoute requiredUserType="business">
                <QRCodeManagementPage />
              </ProtectedRoute>
            } />
            
            {/* Admin routes - protected with business user type requirement */}
            <Route path="/admin" element={
              <ProtectedRoute requiredUserType="business">
                <AdminPage />
              </ProtectedRoute>
            } />
            
            {/* Testing routes - protected with business user type requirement */}
            <Route path="/registration-test" element={
              <ProtectedRoute requiredUserType="business">
                <RegistrationTestPage />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
