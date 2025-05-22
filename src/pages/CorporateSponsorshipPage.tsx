
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
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
import SponsorshipVideoSection from '@/components/sponsorship/SponsorshipVideoSection';

const CorporateSponsorshipPage = () => {
  // Ensure page scrolls to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Corporate Sponsorship | Mansa Musa Marketplace</title>
        <meta name="description" content="Join our corporate sponsorship program and help support Black-owned businesses while gaining visibility and making a meaningful impact in the community." />
      </Helmet>
      
      <SponsorshipHero />
      <SponsorshipImpactStats />
      <SponsorshipBenefits />
      <SponsorshipVideoSection />
      <SponsorshipShowcase />
      <SponsorshipTimeline />
      <SponsorshipTiers />
      <SponsorshipSuccessStories />
      <SponsorshipTestimonials />
      <SponsorshipMediaKit />
      <SponsorshipFAQ />
      <SponsorshipContact />
      <SponsorshipForm />
    </ResponsiveLayout>
  );
};

export default CorporateSponsorshipPage;
