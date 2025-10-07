
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ComprehensiveSystemTest from '@/components/testing/comprehensive/ComprehensiveSystemTest';

const ComprehensiveTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Comprehensive System Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Complete system test for mobile deployment readiness" />
      </Helmet>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">Comprehensive System Test</h1>
          <p className="text-blue-100">
            Complete frontend and backend testing for mobile deployment readiness
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <ComprehensiveSystemTest />
      </main>
    </div>
  );
};

export default ComprehensiveTestPage;
