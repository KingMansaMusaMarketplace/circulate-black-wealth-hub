
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HowItWorks/HeroSection';
import HowItWorksSteps from '@/components/HowItWorks/HowItWorksSteps';
import BenefitsSection from '@/components/HowItWorks/BenefitsSection';
import MansaMusaHistory from '@/components/HowItWorks/MansaMusaHistory';
import FAQSection from '@/components/HowItWorks/FAQSection';
import CTASection from '@/components/HowItWorks/CTASection';

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
