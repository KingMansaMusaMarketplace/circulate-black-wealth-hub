
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import pages
import DirectoryPage from '@/pages/DirectoryPage';
import EnhancedDirectoryPage from '@/pages/EnhancedDirectoryPage';
import HBCUTestPage from '@/pages/HBCUTestPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';

console.log('App.tsx: Starting App component render');

const App: React.FC = () => {
  console.log('App: Component rendering');
  
  return (
    <ErrorBoundary>
      <TooltipProvider delayDuration={300}>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/enhanced-directory" element={<EnhancedDirectoryPage />} />
            <Route path="/hbcu-test" element={<HBCUTestPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;
