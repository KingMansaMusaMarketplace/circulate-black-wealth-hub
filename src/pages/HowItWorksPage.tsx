
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  HeroSection,
  HowItWorksSteps,
  BenefitsSection,
  MansaMusaHistory,
  FAQSection,
  CTASection
} from '@/components/HowItWorks';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSteps />
        <BenefitsSection />
        <MansaMusaHistory />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
