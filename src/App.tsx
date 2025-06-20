
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import pages with lazy loading to prevent initialization issues
const DirectoryPage = React.lazy(() => import('@/pages/DirectoryPage'));
const EnhancedDirectoryPage = React.lazy(() => import('@/pages/EnhancedDirectoryPage'));
const HBCUTestPage = React.lazy(() => import('@/pages/HBCUTestPage'));
const Index = React.lazy(() => import('@/pages/Index'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));

console.log('App.tsx: Starting App component render');

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="text-2xl font-bold text-mansablue">Loading...</div>
    </div>
  </div>
);

const App: React.FC = () => {
  console.log('App: Component rendering');
  
  return (
    <ErrorBoundary>
      <TooltipProvider delayDuration={300}>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/enhanced-directory" element={<EnhancedDirectoryPage />} />
              <Route path="/hbcu-test" element={<HBCUTestPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </Suspense>
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;
