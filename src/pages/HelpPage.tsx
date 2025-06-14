
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import StillNeedHelpSection from '@/components/help-center/StillNeedHelpSection';
import ContactSupportCard from '@/components/help-center/ContactSupportCard';

const HelpPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Help Center - Mansa Musa Marketplace</title>
        <meta name="description" content="Get help and support for Mansa Musa Marketplace. Find resources and contact our support team." />
      </Helmet>

      <Navbar />
      <main className="flex-grow">
        <div className="bg-mansablue py-16">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Help Center</h1>
            <p className="text-white/80 mt-4 max-w-2xl">
              We're here to help you succeed on the Mansa Musa Marketplace platform.
            </p>
          </div>
        </div>
        
        <div className="py-16">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <StillNeedHelpSection />
              </div>
              <ContactSupportCard />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpPage;
