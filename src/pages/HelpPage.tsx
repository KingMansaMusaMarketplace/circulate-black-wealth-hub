
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { HelpSection } from '@/components/help/HelpSection';
import { BusinessHelpSection } from '@/components/help/BusinessHelpSection';
import { useAuth } from '@/contexts/AuthContext';

const HelpPage = () => {
  const { user } = useAuth();
  
  // Check if user is a business owner
  const isBusinessUser = user?.user_metadata?.user_type === 'business' || 
                        user?.user_metadata?.userType === 'business';

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{isBusinessUser ? 'Business Help Center' : 'Help Center'} - Mansa Musa Marketplace</title>
        <meta name="description" content={isBusinessUser ? 
          'Business help and support for Mansa Musa Marketplace. Grow your business with our platform.' :
          'Get help and support for Mansa Musa Marketplace. Find resources and contact our support team.'} />
      </Helmet>

      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom">
          {isBusinessUser ? <BusinessHelpSection /> : <HelpSection />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpPage;
