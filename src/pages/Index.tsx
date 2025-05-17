
import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FeaturedBusinesses from '../components/FeaturedBusinesses';
import WhySection from '../components/WhySection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';
import LogoShowcase from '../components/brand/LogoShowcase';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <LogoShowcase />
      <HowItWorks />
      <WhySection />
      <FeaturedBusinesses />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
