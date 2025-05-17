
import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FeaturedBusinesses from '../components/FeaturedBusinesses';
import WhySection from '../components/WhySection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <WhySection />
      <FeaturedBusinesses />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
