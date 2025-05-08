
import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import WhySection from '@/components/WhySection';
import FeaturedBusinesses from '@/components/FeaturedBusinesses';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import WelcomeBanner from '@/components/WelcomeBanner';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Circulate Black Wealth Hub - Building Economic Legacy</title>
        <meta name="description" content="Discover and support Black-owned businesses, earn rewards, and help circulate Black wealth. Join our community dedicated to building economic legacy together." />
        <meta name="keywords" content="black-owned businesses, wealth circulation, economic empowerment, black business directory, loyalty rewards" />
        <meta property="og:title" content="Circulate Black Wealth Hub - Building Economic Legacy" />
        <meta property="og:description" content="Discover and support Black-owned businesses, earn rewards, and help circulate Black wealth. Join our community dedicated to building economic legacy together." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Circulate Black Wealth Hub - Building Economic Legacy" />
        <meta name="twitter:description" content="Discover and support Black-owned businesses, earn rewards, and help circulate Black wealth. Join our community dedicated to building economic legacy together." />
        <link rel="canonical" href="https://circulate-black-wealth-hub.lovable.app/" />
      </Helmet>

      <Navbar />
      <WelcomeBanner />
      <main className="flex-grow">
        <Hero />
        <WhySection />
        <HowItWorks />
        <FeaturedBusinesses />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
