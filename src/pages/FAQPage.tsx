
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import FAQSection from '@/components/HowItWorks/FAQSection';

const FAQPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>FAQ - Mansa Musa Marketplace</title>
        <meta name="description" content="Frequently asked questions about Mansa Musa Marketplace. Find answers to common questions about our platform." />
      </Helmet>

      <Navbar />
      <main className="flex-grow">
        <div className="bg-mansablue py-16">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Frequently Asked Questions</h1>
            <p className="text-white/80 mt-4 max-w-2xl">
              Find answers to common questions about our platform and services.
            </p>
          </div>
        </div>
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
