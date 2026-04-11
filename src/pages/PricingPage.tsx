import React from 'react';
import PricingSection from '@/components/HomePage/PricingSection';
import { Helmet } from 'react-helmet-async';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-mansagold/5 via-transparent to-transparent" />
      <div className="relative z-10 pt-20">
      <Helmet>
        <title>Pricing | Kayla AI - Plans for Every Business</title>
        <meta name="description" content="Choose the right Kayla AI plan for your business. From Essentials at $19/mo to Enterprise with multi-location support. Replace $1,650–$5,750/month in labor costs." />
      </Helmet>
      <PricingSection />
      </div>
    </div>
  );
};

export default PricingPage;
