import React from 'react';
import { Helmet } from 'react-helmet-async';
import SponsorshipMediaKit from '@/components/sponsorship/SponsorshipMediaKit';
import SponsorshipHeroSection from '@/components/sponsorship/SponsorshipHeroSection';
import RecognitionStrip from '@/components/sponsorship/RecognitionStrip';
import SponsorshipImpactSection from '@/components/sponsorship/SponsorshipImpactSection';
import SponsorshipTiersSection from '@/components/sponsorship/SponsorshipTiersSection';
import EngagementProcessSection from '@/components/sponsorship/EngagementProcessSection';
import FounderNoteSection from '@/components/sponsorship/FounderNoteSection';
import SponsorshipCTASection from '@/components/sponsorship/SponsorshipCTASection';
import SponsorshipForm from '@/components/sponsorship/SponsorshipForm';
import SponsorshipTrustFooter from '@/components/sponsorship/SponsorshipTrustFooter';
import { useSponsorshipActions } from '@/hooks/useSponsorshipActions';

const CorporateSponsorshipPage: React.FC = () => {
  const {
    isGeneratingPDF,
    handleLearnMore,
    handleContactPartnership,
    handleDownloadGuide,
  } = useSponsorshipActions();

  return (
    <>
      <Helmet>
        <title>Corporate Partnerships | 1325.AI</title>
        <meta
          name="description"
          content="Partner with 1325.AI to invest in the infrastructure of Black economic circulation. Patent-pending technology, 33-agent AI workforce, verified national network."
        />
      </Helmet>

      <main className="flex-grow min-h-screen relative overflow-hidden bg-black">
        {/* Single soft ambient layer — no rainbow blobs */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-mansagold/[0.06] rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-mansagold/[0.04] rounded-full blur-[140px]" />
        </div>

        <SponsorshipHeroSection onContactPartnership={handleContactPartnership} />
        <RecognitionStrip />
        <SponsorshipImpactSection />
        <SponsorshipTiersSection onLearnMore={handleLearnMore} />
        <EngagementProcessSection />
        <FounderNoteSection />
        <SponsorshipForm />
        <SponsorshipMediaKit />
        <SponsorshipCTASection
          onContactPartnership={handleContactPartnership}
          onDownloadGuide={handleDownloadGuide}
          isGeneratingPDF={isGeneratingPDF}
        />
        <SponsorshipTrustFooter />
      </main>
    </>
  );
};

export default CorporateSponsorshipPage;
