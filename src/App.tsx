import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { ThemeProvider } from "@/components/theme-provider"
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import BusinessProfilePage from '@/pages/BusinessProfilePage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import BusinessDirectoryPage from '@/pages/BusinessDirectoryPage';
import LoyaltyHistoryPage from '@/pages/LoyaltyHistoryPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import AboutUsPage from '@/pages/AboutUsPage';
import NotFound from '@/pages/NotFound';
import AdminPage from '@/pages/AdminPage';
import QRCodeManagementPage from '@/pages/QRCodeManagementPage';

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="marketplace-theme">
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // After the very first load, set isFirstLoad to false
    setIsFirstLoad(false);
  }, []);

  // Function to determine if the current route is a public route
  const isPublicRoute = () => {
    const publicRoutes = ['/', '/login', '/signup', '/how-it-works', '/about', '/directory'];
    return publicRoutes.includes(location.pathname);
  };

  // If loading, show a loading indicator
  if (loading && isFirstLoad) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // If not loading, proceed with routing
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/directory" element={<BusinessDirectoryPage />} />

      {/* Private Routes - accessible only when authenticated */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <DashboardPage />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
      <Route
        path="/business-profile"
        element={
          user ? (
            <BusinessProfilePage />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
      <Route
        path="/profile"
        element={
          user ? (
            <ProfilePage />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
      <Route
        path="/settings"
        element={
          user ? (
            <SettingsPage />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
      <Route
        path="/loyalty-history"
        element={
          user ? (
            <LoyaltyHistoryPage />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
      <Route
        path="/admin"
        element={
          user ? (
            <AdminPage />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />

      {/* Add a new route for QR code management: */}
      <Route path="/qr-code-management" element={<QRCodeManagementPage />} />

      {/* Not Found Route - matches any route that doesn't match the above */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
