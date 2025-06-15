
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';

const SponsorshipPage: React.FC = () => {
  return (
    <ResponsiveLayout
      title="Corporate Sponsorship"
      description="Partner with Mansa Musa Marketplace"
    >
      <Helmet>
        <title>Corporate Sponsorship | Mansa Musa Marketplace</title>
        <meta name="description" content="Corporate sponsorship opportunities with Mansa Musa Marketplace" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-mansablue mb-6 text-center">
          Corporate Sponsorship
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Partner with us to create meaningful economic impact while supporting Black-owned businesses 
          and strengthening communities across the nation.
        </p>
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Sponsorship program details coming soon...
          </p>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default SponsorshipPage;
