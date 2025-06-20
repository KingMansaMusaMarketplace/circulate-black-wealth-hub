
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import pages
import DirectoryPage from '@/pages/DirectoryPage';
import EnhancedDirectoryPage from '@/pages/EnhancedDirectoryPage';
import HBCUTestPage from '@/pages/HBCUTestPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';

console.log('App.tsx: Rendering App component');

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/enhanced-directory" element={<EnhancedDirectoryPage />} />
          <Route path="/hbcu-test" element={<HBCUTestPage />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
