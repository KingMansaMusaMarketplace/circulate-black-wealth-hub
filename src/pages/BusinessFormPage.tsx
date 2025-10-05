
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BusinessForm from '@/components/business/BusinessForm';

const BusinessFormPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Business Registration | Mansa Musa Marketplace</title>
        <meta name="description" content="Register your business with Mansa Musa Marketplace" />
      </Helmet>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-mansablue mb-6 text-center">
              Register Your Business
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              Join the Mansa Musa Marketplace and connect with customers in your community.
            </p>
            <BusinessForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessFormPage;
