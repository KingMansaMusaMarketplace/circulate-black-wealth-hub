
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import ProfilePage from './pages/ProfilePage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';
import AboutPage from './pages/AboutPage';
import AboutUsPage from './pages/AboutUsPage';
import TeamContactPage from './pages/TeamContactPage';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/auth/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/business/:id" element={<BusinessProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Directory route */}
          <Route path="/directory" element={<BusinessDirectoryPage />} />
          
          {/* About pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/team-contact" element={<TeamContactPage />} />
          
          {/* 404 Not Found page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
