
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
import VerifiedCorporationBadge from '@/components/ui/VerifiedCorporationBadge';

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
      
      <main className="flex-grow bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 min-h-screen relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
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
        
        <div className="relative z-10">
          <SponsorshipForm />
          
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <VerifiedCorporationBadge variant="detailed" />
              </div>
            </div>
          </section>
        </div>
        
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
