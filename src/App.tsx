
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import pages
import DirectoryPage from '@/pages/DirectoryPage';
import EnhancedDirectoryPage from '@/pages/EnhancedDirectoryPage';
import HBCUTestPage from '@/pages/HBCUTestPage';

console.log('App.tsx: Rendering App component');

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<DirectoryPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/enhanced-directory" element={<EnhancedDirectoryPage />} />
        <Route path="/hbcu-test" element={<HBCUTestPage />} />
      </Routes>
    </div>
  );
};

export default App;
