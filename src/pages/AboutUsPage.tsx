
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/AboutPage/HeroSection';
import MissionSection from '@/components/AboutPage/MissionSection';
import AuthorSection from '@/components/AboutPage/AuthorSection';
import MansaMusaVideoSection from '@/components/AboutPage/MansaMusaVideoSection';
import QuoteSection from '@/components/AboutPage/QuoteSection';
import CTASection from '@/components/AboutPage/CTASection';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>About Us | Mansa Musa Marketplace</title>
        <meta name="description" content="Learn about Mansa Musa Marketplace - building the future of Black wealth circulation through intentional economic infrastructure." />
      </Helmet>

      <Navbar />
      
      <main>
        <HeroSection />
        <MissionSection />
        <AuthorSection />
        <MansaMusaVideoSection />
        <QuoteSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
