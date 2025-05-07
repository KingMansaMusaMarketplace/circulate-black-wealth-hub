
import React, { useEffect } from 'react';
import { 
  HeroSection, 
  HowItWorksSteps, 
  BenefitsSection, 
  MansaMusaHistory, 
  FAQSection, 
  CTASection,
  TestimonialsSection,
  CirculationVisualization
} from '@/components/HowItWorks';
import { PageNavigation } from '@/components/HowItWorks';

const HowItWorksPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'How It Works | Mansa Musa Marketplace';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PageNavigation />
      <HowItWorksSteps />
      <CirculationVisualization />
      <BenefitsSection />
      <TestimonialsSection />
      <MansaMusaHistory />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default HowItWorksPage;
