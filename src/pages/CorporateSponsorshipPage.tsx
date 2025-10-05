
import React from 'react';
import { Helmet } from 'react-helmet';
import SponsorshipMediaKit from '@/components/sponsorship/SponsorshipMediaKit';
import SponsorshipHeroSection from '@/components/sponsorship/SponsorshipHeroSection';
import SponsorshipImpactSection from '@/components/sponsorship/SponsorshipImpactSection';
import SponsorshipTiersSection from '@/components/sponsorship/SponsorshipTiersSection';
import SponsorshipCTASection from '@/components/sponsorship/SponsorshipCTASection';
import SponsorshipForm from '@/components/sponsorship/SponsorshipForm';
import { useSponsorshipActions } from '@/hooks/useSponsorshipActions';
import { ContextualTooltip } from '@/components/ui/ContextualTooltip';
import { ProgressiveDisclosure } from '@/components/ui/ProgressiveDisclosure';
import { CORPORATE_CONTEXTUAL_TIPS } from '@/lib/corporate-onboarding-constants';

const CorporateSponsorshipPage: React.FC = () => {
  const {
    isGeneratingPDF,
    handleLearnMore,
    handleContactPartnership,
    handleDownloadGuide
  } = useSponsorshipActions();

  return (
    <>
      <Helmet>
        <title>Corporate Sponsorship - Mansa Musa Marketplace</title>
        <meta name="description" content="Partner with Mansa Musa Marketplace to support Black-owned businesses and create meaningful economic impact in communities." />
      </Helmet>
      
      <main className="flex-grow">
        <ProgressiveDisclosure
          id="corporate-sponsorship-welcome"
          title="Ready to Drive Real Community Impact?"
          message="Join forward-thinking corporations making a measurable difference. Our partnership program connects your brand with engaged customers while creating authentic economic impact in Black communities."
          autoShow={true}
          position="top"
          actionText="Explore Partnership Opportunities"
        />
        
        <SponsorshipHeroSection onContactPartnership={handleContactPartnership} />
        
        <ContextualTooltip
          id="sponsorship-impact-metrics"
          title={CORPORATE_CONTEXTUAL_TIPS['impact-analytics'].title}
          tip={CORPORATE_CONTEXTUAL_TIPS['impact-analytics'].tip}
          trigger="auto"
          delay={3000}
        >
          <SponsorshipImpactSection />
        </ContextualTooltip>
        
        <ContextualTooltip
          id="sponsorship-tier-selection"
          title={CORPORATE_CONTEXTUAL_TIPS['sponsorship-tiers'].title}
          tip={CORPORATE_CONTEXTUAL_TIPS['sponsorship-tiers'].tip}
          trigger="hover"
        >
          <SponsorshipTiersSection onLearnMore={handleLearnMore} />
        </ContextualTooltip>
        
        <SponsorshipForm />
        <SponsorshipMediaKit />
        <SponsorshipCTASection 
          onContactPartnership={handleContactPartnership}
          onDownloadGuide={handleDownloadGuide}
          isGeneratingPDF={isGeneratingPDF}
        />
      </main>
    </>
  );
};

export default CorporateSponsorshipPage;
