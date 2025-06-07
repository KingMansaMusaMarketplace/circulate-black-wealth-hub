
import React from 'react';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import {
  ContactSupportCard,
  GettingStartedFAQ,
  AccountBillingFAQ,
  BusinessFeaturesFAQ,
  StillNeedHelpSection
} from '@/components/help-center';

const HelpCenterPage = () => {
  return (
    <ResponsiveLayout
      title="Help Center"
      description="Get help and support for using Mansa Musa Marketplace"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mansablue mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">
            Find answers to your questions and get the support you need
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <ContactSupportCard />
          
          <div className="lg:col-span-2 space-y-6">
            <GettingStartedFAQ />
            <AccountBillingFAQ />
            <BusinessFeaturesFAQ />
          </div>
        </div>

        <StillNeedHelpSection />
      </div>
    </ResponsiveLayout>
  );
};

export default HelpCenterPage;
