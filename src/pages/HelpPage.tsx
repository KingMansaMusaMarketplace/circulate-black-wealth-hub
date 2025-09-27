
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { HelpSection } from '@/components/help/HelpSection';
import { BusinessHelpSection } from '@/components/help/BusinessHelpSection';
import { CorporateHelpSection } from '@/components/help/CorporateHelpSection';
import SalesAgentHelpSection from '@/components/help/SalesAgentHelpSection';
import { useAuth } from '@/contexts/AuthContext';
import { useSalesAgent } from '@/hooks/use-sales-agent';

const HelpPage = () => {
  const { user } = useAuth();
  const { isAgent } = useSalesAgent();
  
  // Check user type
  const isBusinessUser = user?.user_metadata?.user_type === 'business' || 
                        user?.user_metadata?.userType === 'business';
  
  const isCorporateUser = user?.user_metadata?.user_type === 'corporate' || 
                         user?.user_metadata?.userType === 'corporate' ||
                         user?.user_metadata?.subscription_tier?.includes('corporate');

  // Determine which help section to show
  const getHelpSectionTitle = () => {
    if (isAgent) return 'Sales Agent Support Center';
    if (isCorporateUser) return 'Corporate Partnership Center';
    if (isBusinessUser) return 'Business Help Center';
    return 'Help Center';
  };

  const getMetaDescription = () => {
    if (isAgent) return 'Sales agent help and support for Mansa Musa Marketplace. Maximize your referral earnings and grow your network.';
    if (isCorporateUser) return 'Corporate partnership help and support for Mansa Musa Marketplace. Maximize your sponsorship impact and community engagement.';
    if (isBusinessUser) return 'Business help and support for Mansa Musa Marketplace. Grow your business with our platform.';
    return 'Get help and support for Mansa Musa Marketplace. Find resources and contact our support team.';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{getHelpSectionTitle()} - Mansa Musa Marketplace</title>
        <meta name="description" content={getMetaDescription()} />
      </Helmet>

      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom">
          {isAgent ? (
            <SalesAgentHelpSection />
          ) : isCorporateUser ? (
            <CorporateHelpSection />
          ) : isBusinessUser ? (
            <BusinessHelpSection />
          ) : (
            <HelpSection />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpPage;
