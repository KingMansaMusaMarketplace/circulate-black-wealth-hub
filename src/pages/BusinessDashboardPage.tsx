
import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import BusinessProfileManager from '@/components/business/BusinessProfileManager';

const BusinessDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Business Dashboard | Mansa Musa Marketplace</title>
        <meta name="description" content="Manage your business profile, analytics, and engagement tools" />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <BusinessProfileManager />
      </main>
      
      <Footer />
    </div>
  );
};

export default BusinessDashboardPage;
