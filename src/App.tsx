
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RequireBusiness from '@/components/auth/RequireBusiness';

// Import pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import BusinessProfilePage from '@/pages/BusinessProfilePage';
import ProfilePage from '@/pages/ProfilePage';
import LoyaltyPage from '@/pages/LoyaltyPage';
import QRCodeManagementPage from '@/pages/QRCodeManagementPage';
import SalesAgentPage from '@/pages/SalesAgentPage';
import SettingsPage from '@/pages/SettingsPage';
import QRScannerPage from '@/pages/QRScannerPage';
import CorporateSponsorshipPage from '@/pages/CorporateSponsorshipPage';
import HowItWorksPage from '@/pages/HowItWorksPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SubscriptionProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/qr-scanner" element={<QRScannerPage />} />
                <Route path="/corporate-sponsorship" element={<CorporateSponsorshipPage />} />
                
                {/* Protected routes */}
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
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                
                {/* Business only routes */}
                <Route path="/business-profile" element={
                  <RequireBusiness>
                    <BusinessProfilePage />
                  </RequireBusiness>
                } />
                
                <Route path="/qr-management" element={
                  <RequireBusiness>
                    <QRCodeManagementPage />
                  </RequireBusiness>
                } />
                
                <Route path="/sales-agent" element={
                  <ProtectedRoute>
                    <SalesAgentPage />
                  </ProtectedRoute>
                } />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </SubscriptionProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
