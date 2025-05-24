
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import ProfilePage from './pages/ProfilePage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';
import BusinessesPage from './pages/BusinessesPage';
import AboutPage from './pages/AboutPage';
import AboutUsPage from './pages/AboutUsPage';
import TeamContactPage from './pages/TeamContactPage';
import NotFound from './pages/NotFound';
import LoyaltyPage from './pages/LoyaltyPage';
import LoyaltyHistoryPage from './pages/LoyaltyHistoryPage';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/auth/AuthProvider';
import HowItWorksPage from './pages/HowItWorksPage';
import CorporateSponsorshipPage from './pages/CorporateSponsorshipPage';
import FAQPage from './pages/FAQPage';
import SalesAgentPage from './pages/SalesAgentPage';
import HBCUTestPage from './pages/HBCUTestPage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/business/:id" element={<BusinessProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Directory routes */}
            <Route path="/directory" element={<BusinessDirectoryPage />} />
            <Route path="/businesses" element={<BusinessesPage />} />
            
            {/* Loyalty routes */}
            <Route path="/loyalty" element={<LoyaltyPage />} />
            <Route path="/loyalty-history" element={<LoyaltyHistoryPage />} />
            
            {/* About pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/our-team" element={<TeamContactPage />} />
            <Route path="/team-contact" element={<TeamContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            
            {/* How it works */}
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            
            {/* Corporate sponsorship */}
            <Route path="/corporate-sponsorship" element={<CorporateSponsorshipPage />} />
            
            {/* Sales agent */}
            <Route path="/sales-agent" element={<SalesAgentPage />} />
            
            {/* Development/Testing Route */}
            {process.env.NODE_ENV === 'development' && (
              <Route path="/hbcu-test" element={<HBCUTestPage />} />
            )}
            
            {/* 404 Not Found page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
