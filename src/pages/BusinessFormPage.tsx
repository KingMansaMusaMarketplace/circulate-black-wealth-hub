
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BusinessForm from '@/components/business/BusinessForm';

const BusinessFormPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden flex flex-col">
      <Helmet>
        <title>Business Registration | Mansa Musa Marketplace</title>
        <meta name="description" content="Register your business with Mansa Musa Marketplace" />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>

      {/* Hero Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-800/60 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-mansablue/20 via-blue-500/20 to-mansagold/20" />
            
            {/* Animated decorative elements */}
            <div className="absolute top-8 right-10 w-32 h-32 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-8 left-10 w-40 h-40 bg-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="relative px-8 py-12 text-white">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in-up bg-gradient-to-r from-mansagold via-amber-400 to-orange-400 bg-clip-text text-transparent">Register Your Business</h1>
              <p className="text-xl text-slate-300 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
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
