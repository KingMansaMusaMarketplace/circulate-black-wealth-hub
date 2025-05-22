
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import ProfilePage from './pages/ProfilePage';
import DirectoryPage from './pages/DirectoryPage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/business/:id" element={<BusinessProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Update directory route to use BusinessDirectoryPage */}
        <Route path="/directory" element={<BusinessDirectoryPage />} />
        
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
