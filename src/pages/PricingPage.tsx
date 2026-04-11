import React from 'react';
import PricingSection from '@/components/HomePage/PricingSection';
import { Helmet } from 'react-helmet-async';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Pricing | Kayla AI - Plans for Every Business</title>
        <meta name="description" content="Choose the right Kayla AI plan for your business. From Essentials at $19/mo to Enterprise with multi-location support. Replace $1,650–$5,750/month in labor costs." />
      </Helmet>
      <PricingSection />
    </div>
  );
};

export default PricingPage;
