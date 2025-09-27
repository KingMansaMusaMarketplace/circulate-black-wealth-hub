
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { HelpSection } from '@/components/help/HelpSection';

const HelpPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Help Center - Mansa Musa Marketplace</title>
        <meta name="description" content="Get help and support for Mansa Musa Marketplace. Find resources and contact our support team." />
      </Helmet>

      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom">
          <HelpSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpPage;
