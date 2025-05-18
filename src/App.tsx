
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Index from '@/pages/Index';
import AboutPage from '@/pages/AboutPage';
import DirectoryPage from '@/pages/DirectoryPage';
import BusinessDetailPage from '@/pages/BusinessDetailPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import DashboardPage from '@/pages/DashboardPage';
import QRScannerPage from '@/pages/QRScannerPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import SignupSuccessPage from '@/pages/SignupSuccessPage';
import SettingsPage from '@/pages/SettingsPage';
import BusinessProfilePage from '@/pages/BusinessProfilePage';
import AdminPage from '@/pages/AdminPage';
import QRCodeManagementPage from '@/pages/QRCodeManagementPage';
import CapacitorTestPage from '@/pages/CapacitorTestPage'; // Add the new test page
import NotFound from '@/pages/NotFound';

// Context Providers
import { AuthProvider } from '@/contexts/auth';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster as SonnerToaster } from 'sonner';
import { initializeCapacitorPlugins } from '@/utils/capacitor-plugins';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Capacitor plugins
    const initPlugins = async () => {
      try {
        await initializeCapacitorPlugins();
      } catch (error) {
        console.error('Error initializing Capacitor plugins:', error);
      }
      setIsLoading(false);
    };

    initPlugins();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-t-4 border-mansablue border-solid rounded-full"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <SubscriptionProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/business/:id" element={<BusinessDetailPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/scan" element={<QRScannerPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signup-success" element={<SignupSuccessPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/business-profile" element={<BusinessProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/qr-code-management" element={<QRCodeManagementPage />} />
              <Route path="/capacitor-test" element={<CapacitorTestPage />} /> {/* Add the new route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SonnerToaster position="top-right" />
            <Toaster />
          </Router>
        </ThemeProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
