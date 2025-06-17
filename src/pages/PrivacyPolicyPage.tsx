
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Privacy Policy - Mansa Musa Marketplace</title>
        <meta name="description" content="Privacy Policy for Mansa Musa Marketplace - Learn how we protect and manage your data." />
      </Helmet>

      <Navbar />
      <main className="flex-grow py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-mansablue mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-full">
            <p className="text-lg mb-6">Last Updated: May 8, 2025</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Mansa Musa Marketplace ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <p>
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Register for an account</li>
              <li>Sign up for our newsletter</li>
              <li>Participate in promotions or surveys</li>
              <li>Contact us</li>
              <li>Use our platform's features</li>
            </ul>
            
            <p>The types of information we may collect include:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Contact information (name, email address, phone number)</li>
              <li>Account credentials</li>
              <li>Profile information</li>
              <li>Payment information</li>
              <li>Transaction history</li>
              <li>Communications with us</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We may use your information to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative messages and updates</li>
              <li>Respond to your comments and questions</li>
              <li>Provide customer support</li>
              <li>Send marketing communications</li>
              <li>Analyze usage patterns and trends</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Privacy Rights</h2>
            <p>
              Depending on where you live, you may have certain rights regarding your personal information, 
              including the right to access, correct, delete, or restrict the use of your personal information.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our practices, please contact us at:
              <br />
              <a href="mailto:privacy@mansamusamarketplace.com" className="text-mansablue hover:underline">
                privacy@mansamusamarketplace.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
