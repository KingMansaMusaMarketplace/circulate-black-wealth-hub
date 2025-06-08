
import React from 'react';
import { Helmet } from 'react-helmet';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import StripeTestComponent from '@/components/subscription/StripeTestComponent';

const StripeTestPage: React.FC = () => {
  return (
    <ResponsiveLayout
      title="Stripe Payment Test"
      description="Test and verify Stripe payment integration"
    >
      <Helmet>
        <title>Stripe Test | Mansa Musa Marketplace</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-mansablue">
            Stripe Payment System Test
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use this page to test the Stripe payment integration, checkout flows, 
            and subscription management features.
          </p>
        </div>

        <StripeTestComponent />
      </div>
    </ResponsiveLayout>
  );
};

export default StripeTestPage;
