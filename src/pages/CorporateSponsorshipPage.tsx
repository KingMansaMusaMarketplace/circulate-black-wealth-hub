
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import SponsorshipMediaKit from '@/components/sponsorship/SponsorshipMediaKit';
import SponsorshipHeroSection from '@/components/sponsorship/SponsorshipHeroSection';
import SponsorshipImpactSection from '@/components/sponsorship/SponsorshipImpactSection';
import SponsorshipTiersSection from '@/components/sponsorship/SponsorshipTiersSection';
import SponsorshipCTASection from '@/components/sponsorship/SponsorshipCTASection';
import SponsorshipForm from '@/components/sponsorship/SponsorshipForm';
import { useSponsorshipActions } from '@/hooks/useSponsorshipActions';

const CorporateSponsorshipPage: React.FC = () => {
  const {
    isGeneratingPDF,
    handleLearnMore,
    handleContactPartnership,
    handleDownloadGuide
  } = useSponsorshipActions();

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Corporate Sponsorship - Mansa Musa Marketplace</title>
        <meta name="description" content="Partner with Mansa Musa Marketplace to support Black-owned businesses and create meaningful economic impact in communities." />
      </Helmet>

      <Navbar />
      
      <main className="flex-grow">
        <SponsorshipHeroSection onContactPartnership={handleContactPartnership} />
        <SponsorshipImpactSection />
        <SponsorshipTiersSection onLearnMore={handleLearnMore} />
        <SponsorshipForm />
        <SponsorshipMediaKit />
        <SponsorshipCTASection 
          onContactPartnership={handleContactPartnership}
          onDownloadGuide={handleDownloadGuide}
          isGeneratingPDF={isGeneratingPDF}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default CorporateSponsorshipPage;
