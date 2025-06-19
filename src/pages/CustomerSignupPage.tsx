
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';

const CustomerSignupPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Customer Sign Up | Mansa Musa Marketplace</title>
        <meta name="description" content="Join Mansa Musa Marketplace as a customer" />
      </Helmet>

      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">Customer Sign Up</h1>
            <p className="text-center text-gray-600">Customer signup form coming soon...</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerSignupPage;
