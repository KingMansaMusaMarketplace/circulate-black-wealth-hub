
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HowItWorks/HeroSection';
import HowItWorksSteps from '@/components/HowItWorks/HowItWorksSteps';
import BenefitsSection from '@/components/HowItWorks/BenefitsSection';
import MansaMusaHistory from '@/components/HowItWorks/MansaMusaHistory';
import FAQSection from '@/components/HowItWorks/FAQSection';
import CTASection from '@/components/HowItWorks/CTASection';
import TestimonialsSection from '@/components/HowItWorks/TestimonialsSection';
import CirculationVisualization from '@/components/HowItWorks/CirculationVisualization/CirculationVisualization';
import PageNavigation from '@/components/HowItWorks/PageNavigation';

const HowItWorksPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'How It Works | Mansa Musa Marketplace';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <PageNavigation 
        sections={[
          { id: 'how-it-works', label: 'How It Works' },
          { id: 'circulation-visualization', label: 'Money Flow' },
          { id: 'benefits', label: 'Benefits' },
          { id: 'testimonials', label: 'Testimonials' },
          { id: 'history', label: 'Our Story' },
          { id: 'faq', label: 'FAQ' }
        ]}
      />
      <HowItWorksSteps />
      <CirculationVisualization />
      <BenefitsSection />
      <TestimonialsSection />
      <MansaMusaHistory />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
