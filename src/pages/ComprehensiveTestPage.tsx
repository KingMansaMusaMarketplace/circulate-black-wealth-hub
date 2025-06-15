
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import ComprehensiveSystemTest from '@/components/testing/comprehensive/ComprehensiveSystemTest';

const ComprehensiveTestPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Comprehensive System Test | Mansa Musa Marketplace</title>
        <meta name="description" content="Complete system test for mobile deployment readiness" />
      </Helmet>

      <Navbar />
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">Comprehensive System Test</h1>
          <p className="text-blue-100">
            Complete frontend and backend testing for mobile deployment readiness
          </p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <ComprehensiveSystemTest />
      </main>
      
      <Footer />
    </div>
  );
};

export default ComprehensiveTestPage;
