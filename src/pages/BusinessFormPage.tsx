
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BusinessForm from '@/components/business/BusinessForm';

const BusinessFormPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <Helmet>
        <title>Business Registration | Mansa Musa Marketplace</title>
        <meta name="description" content="Register your business with Mansa Musa Marketplace" />
      </Helmet>

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 via-background to-mansagold/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansablue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Hero Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-mansablue via-purple-600 to-mansagold" />
            
            {/* Animated decorative elements */}
            <div className="absolute top-8 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-8 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative px-8 py-12 text-white">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">Register Your Business</h1>
              <p className="text-xl text-white/90 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Join the Mansa Musa Marketplace and connect with customers in your community
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <BusinessForm />
        </div>
      </main>
    </div>
  );
};

export default BusinessFormPage;
