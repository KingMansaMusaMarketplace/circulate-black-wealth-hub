
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
              <div className="max-w-4xl mx-auto space-y-6">
                <VerifiedCorporationBadge variant="detailed" />
                
                {/* Patent Pending Badge */}
                <div className="flex items-center justify-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-mansagold/20">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mansagold to-amber-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-sm">Patent Pending Technology</p>
                    <p className="text-white/70 text-xs">Powered by patent-pending economic circulation technology</p>
                  </div>
                </div>
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
