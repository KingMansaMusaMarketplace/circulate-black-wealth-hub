import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';

const TermsOfServicePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Terms of Service - Mansa Musa Marketplace</title>
        <meta name="description" content="Terms of Service for Mansa Musa Marketplace - Rules and guidelines for using our platform." />
      </Helmet>

      <Navbar />
      <main className="flex-grow py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-mansablue mb-8">Terms of Service</h1>
          
          <div className="prose max-w-full">
            <p className="text-lg mb-6">Last Updated: May 8, 2025</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using Mansa Musa Marketplace, you agree to be bound by these Terms of Service
              and all applicable laws and regulations. If you do not agree with any of these terms, you are
              prohibited from using or accessing this site.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily use the platform for personal, non-commercial use only.
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information.
              You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Marketplace Transactions</h2>
            <p>
              Mansa Musa Marketplace facilitates transactions between buyers and sellers. We are not a 
              party to any transaction between users and are not responsible for the quality, safety,
              legality, or availability of items listed or sold through our platform.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
            <p>
              In no event shall Mansa Musa Marketplace be liable for any damages arising out of the use
              or inability to use the materials on the platform, even if we have been notified of the 
              possibility of such damage.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of
              the United States and you irrevocably submit to the exclusive jurisdiction of the courts
              in that location.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:terms@mansamusamarketplace.com" className="text-mansablue hover:underline">
                terms@mansamusamarketplace.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
