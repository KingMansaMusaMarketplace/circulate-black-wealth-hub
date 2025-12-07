
import React from 'react';
import { Helmet } from 'react-helmet';
import SponsorshipMediaKit from '@/components/sponsorship/SponsorshipMediaKit';
import SponsorshipHeroSection from '@/components/sponsorship/SponsorshipHeroSection';
import SponsorshipImpactSection from '@/components/sponsorship/SponsorshipImpactSection';
import SponsorshipTiersSection from '@/components/sponsorship/SponsorshipTiersSection';
import SponsorshipCTASection from '@/components/sponsorship/SponsorshipCTASection';
import SponsorshipForm from '@/components/sponsorship/SponsorshipForm';
import { useSponsorshipActions } from '@/hooks/useSponsorshipActions';
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
        <title>Corporate Sponsorship | Partner with Mansa Musa Marketplace</title>
        <meta name="description" content="Partner with Mansa Musa Marketplace to support Black-owned businesses and create meaningful economic impact. Join 50+ organizations making a difference." />
      </Helmet>
      
      <main className="flex-grow min-h-screen relative overflow-hidden bg-gradient-to-b from-mansablue-dark via-mansablue to-mansablue-dark">
        {/* Premium ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-mansagold/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[150px]" />
        </div>
        
        {/* Grid pattern overlay */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
        
        <SponsorshipHeroSection onContactPartnership={handleContactPartnership} />
        <SponsorshipImpactSection />
        <SponsorshipTiersSection onLearnMore={handleLearnMore} />
        
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
