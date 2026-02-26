
import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/AboutPage/HeroSection';
import MissionSection from '@/components/AboutPage/MissionSection';
import AuthorSection from '@/components/AboutPage/AuthorSection';
import MansaMusaVideoSection from '@/components/AboutPage/MansaMusaVideoSection';
import QuoteSection from '@/components/AboutPage/QuoteSection';
import CTASection from '@/components/AboutPage/CTASection';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#050a18] to-[#030712]">
      <Helmet>
        <title>About Us | 1325.AI</title>
        <meta name="description" content="Learn about 1325.AI - building the future of community wealth circulation through intentional economic infrastructure." />
      </Helmet>
      
      <main>
        <HeroSection />
        <MissionSection />
        <AuthorSection />
        <MansaMusaVideoSection />
        <QuoteSection />
        <CTASection />
      </main>
    </div>
  );
};

export default AboutUsPage;
