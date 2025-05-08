
import React from 'react';
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
      {/* SEO metadata is handled at the app-level through react-router */}
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
