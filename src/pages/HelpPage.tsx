
import React from 'react';
import { Helmet } from 'react-helmet';
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
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Dark gradient mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      <Helmet>
        <title>{getHelpSectionTitle()} - Mansa Musa Marketplace</title>
        <meta name="description" content={getMetaDescription()} />
      </Helmet>

      <main className="flex-grow py-8 relative z-10">
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
    </div>
  );
};

export default HelpPage;
