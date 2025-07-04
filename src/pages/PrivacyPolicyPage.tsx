
import React from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-mansablue mb-8">Privacy Policy</h1>
        <div className="max-w-4xl mx-auto prose prose-lg">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at privacy@mansamusamarketplace.com.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
