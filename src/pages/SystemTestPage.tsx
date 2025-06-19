
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import SystemHealthTest from '@/components/testing/SystemHealthTest';

const SystemTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>System Health Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Test frontend and backend functionality" />
      </Helmet>

      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-mansablue mb-2">System Health Check</h1>
            <p className="text-gray-600">Verify that all frontend and backend systems are working correctly</p>
          </div>
          
          <SystemHealthTest />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SystemTestPage;
