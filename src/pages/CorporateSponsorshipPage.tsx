
import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SponsorshipHero from '@/components/sponsorship/SponsorshipHero';
import SponsorshipTiers from '@/components/sponsorship/SponsorshipTiers';
import SponsorshipBenefits from '@/components/sponsorship/SponsorshipBenefits';
import SponsorshipForm from '@/components/sponsorship/SponsorshipForm';
import SponsorshipFAQ from '@/components/sponsorship/SponsorshipFAQ';
import SponsorshipTestimonials from '@/components/sponsorship/SponsorshipTestimonials';
import SponsorshipImpactStats from '@/components/sponsorship/SponsorshipImpactStats';
import SponsorshipShowcase from '@/components/sponsorship/SponsorshipShowcase';
import SponsorshipTimeline from '@/components/sponsorship/SponsorshipTimeline';
import SponsorshipSuccessStories from '@/components/sponsorship/SponsorshipSuccessStories';
import SponsorshipMediaKit from '@/components/sponsorship/SponsorshipMediaKit';
import SponsorshipContact from '@/components/sponsorship/SponsorshipContact';

const CorporateSponsorshipPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Corporate Sponsorship | Mansa Musa Marketplace</title>
        <meta name="description" content="Join our corporate sponsorship program and help support Black-owned businesses while gaining visibility and making a meaningful impact in the community." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <SponsorshipHero />
        <SponsorshipImpactStats />
        <SponsorshipBenefits />
        <SponsorshipShowcase />
        <SponsorshipTimeline />
        <SponsorshipTiers />
        <SponsorshipSuccessStories />
        <SponsorshipTestimonials />
        <SponsorshipMediaKit />
        <SponsorshipFAQ />
        <SponsorshipContact />
        <SponsorshipForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default CorporateSponsorshipPage;
