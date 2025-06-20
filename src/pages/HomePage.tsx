
import React from 'react';
import { Helmet } from 'react-helmet-async';

console.log('HomePage.tsx: HomePage component loaded');

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Mansa Musa Marketplace</title>
        <meta name="description" content="Economic empowerment through community marketplace" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mansablue mb-4">
            Welcome to Mansa Musa Marketplace
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Building economic empowerment through community-driven commerce
          </p>
        </header>

        <div className="text-center">
          <a 
            href="/login" 
            className="inline-block bg-mansablue text-white px-6 py-3 rounded-lg hover:bg-mansablue/90 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
