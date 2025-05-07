
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HowItWorks/HeroSection';
import MansaMusaHistory from '@/components/HowItWorks/MansaMusaHistory';
import HowItWorksSteps from '@/components/HowItWorks/HowItWorksSteps';
import BenefitsSection from '@/components/HowItWorks/BenefitsSection';
import FAQSection from '@/components/HowItWorks/FAQSection';
import CTASection from '@/components/HowItWorks/CTASection';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Mansa Musa History Section */}
        <MansaMusaHistory />
        
        {/* Detailed Steps */}
        <HowItWorksSteps />
        
        {/* Benefits Section */}
        <BenefitsSection />
        
        {/* FAQ Section */}
        <FAQSection />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
