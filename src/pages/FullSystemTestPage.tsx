import React from 'react';
import { Helmet } from 'react-helmet-async';
import FullSystemTest from '@/components/testing/FullSystemTest';

const FullSystemTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Full System Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Comprehensive system testing dashboard" />
      </Helmet>

      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-mansablue mb-2">Full System Test</h1>
            <p className="text-gray-600">Comprehensive testing of all critical and non-critical systems</p>
          </div>
          
          <FullSystemTest />
        </div>
      </main>
    </div>
  );
};

export default FullSystemTestPage;