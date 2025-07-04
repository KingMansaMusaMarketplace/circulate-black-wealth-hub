
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import MobileAppWrapper from '@/components/mobile/MobileAppWrapper';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import pages
import HomePage from '@/pages/HomePage';
import BusinessDirectoryPage from '@/pages/BusinessDirectoryPage';
import QRScannerPage from '@/pages/QRScannerPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import BusinessFormPage from '@/pages/BusinessFormPage';
import LoyaltyPage from '@/pages/LoyaltyPage';
import CommunityImpactPage from '@/pages/CommunityImpactPage';
import BusinessDetailPage from '@/pages/BusinessDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import BlogPage from '@/pages/BlogPage';
import NotFound from '@/pages/NotFound';

// Import auth components
import RequireAuth from '@/components/auth/RequireAuth';

const App = () => {
  return (
    <ErrorBoundary>
      <MobileAppWrapper>
        <div className="App min-h-screen bg-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/directory" element={<BusinessDirectoryPage />} />
            <Route path="/business/:id" element={<BusinessDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/business-form" element={<BusinessFormPage />} />
            <Route path="/community-impact" element={<CommunityImpactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            
            {/* Protected Routes */}
            <Route path="/scanner" element={
              <RequireAuth>
                <QRScannerPage />
              </RequireAuth>
            } />
            <Route path="/dashboard" element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            } />
            <Route path="/loyalty" element={
              <RequireAuth>
                <LoyaltyPage />
              </RequireAuth>
            } />
            <Route path="/profile" element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            } />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </MobileAppWrapper>
    </ErrorBoundary>
  );
};

export default App;
