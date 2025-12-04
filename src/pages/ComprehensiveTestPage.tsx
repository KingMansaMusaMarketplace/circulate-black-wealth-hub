
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ComprehensiveSystemTest from '@/components/testing/comprehensive/ComprehensiveSystemTest';

const ComprehensiveTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <Helmet>
        <title>Comprehensive System Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Complete system test for mobile deployment readiness" />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-white">Comprehensive System Test</h1>
            <p className="text-blue-200">
              Complete frontend and backend testing for mobile deployment readiness
            </p>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <ComprehensiveSystemTest />
        </main>
      </div>
    </div>
  );
};

export default ComprehensiveTestPage;
