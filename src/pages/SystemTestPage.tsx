
import React from 'react';
import { Helmet } from 'react-helmet-async';
import SystemHealthTest from '@/components/testing/SystemHealthTest';

const SystemTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      
      <Helmet>
        <title>System Health Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Test frontend and backend functionality" />
      </Helmet>

      <main className="py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
              System Health Check
            </h1>
            <p className="text-blue-200">Verify that all frontend and backend systems are working correctly</p>
          </div>
          
          <SystemHealthTest />
        </div>
      </main>
    </div>
  );
};

export default SystemTestPage;
