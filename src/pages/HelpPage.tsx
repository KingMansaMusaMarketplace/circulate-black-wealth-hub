
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import StillNeedHelpSection from '@/components/help-center/StillNeedHelpSection';
import ContactSupportCard from '@/components/help-center/ContactSupportCard';
import GettingStartedFAQ from '@/components/help-center/GettingStartedFAQ';
import AccountBillingFAQ from '@/components/help-center/AccountBillingFAQ';
import BusinessFeaturesFAQ from '@/components/help-center/BusinessFeaturesFAQ';
import FAQSection from '@/components/AboutPage/FAQSection';

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

        {/* FAQ Section */}
        <FAQSection />
        
        {/* Help Center FAQ Components */}
        <div className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-mansablue mb-4">Help Center FAQs</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about using our platform.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <GettingStartedFAQ />
              <AccountBillingFAQ />
            </div>
            
            <div className="mt-8 max-w-3xl mx-auto">
              <BusinessFeaturesFAQ />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpPage;
