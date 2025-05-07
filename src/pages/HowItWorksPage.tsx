
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HowItWorks/HeroSection';
import HowItWorksSteps from '@/components/HowItWorks/HowItWorksSteps';
import BenefitsSection from '@/components/HowItWorks/BenefitsSection';
import MansaMusaHistory from '@/components/HowItWorks/MansaMusaHistory';
import FAQSection from '@/components/HowItWorks/FAQSection';
import CTASection from '@/components/CTASection';
import TestimonialsSection from '@/components/HowItWorks/TestimonialsSection';
import CirculationVisualization from '@/components/HowItWorks/CirculationVisualization/CirculationVisualization';
import PageNavigation from '@/components/HowItWorks/PageNavigation';
import VisualDivider from '@/components/HowItWorks/VisualDivider';

const HowItWorksPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'How It Works | Mansa Musa Marketplace';
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <HeroSection />
      
      {/* Minimal decorative divider with no extra space */}
      <div className="bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-center">
            <div className="flex items-center space-x-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-mansagold opacity-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
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
      
      <div className="flex-grow">
        <HowItWorksSteps />
        
        {/* Minimal visual separator with no padding */}
        <div className="bg-gray-50">
          <div className="container-custom">
            <div className="flex justify-center">
              <div className="h-0.5 w-24 bg-gradient-to-r from-mansagold/20 via-mansagold to-mansagold/20"></div>
            </div>
          </div>
        </div>
        
        <CirculationVisualization />
        
        {/* Minimal separator with no padding */}
        <div className="bg-white">
          <div className="container-custom">
            <div className="flex justify-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-mansablue"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-mansablue opacity-70"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-mansablue opacity-40"></div>
            </div>
          </div>
        </div>
        
        <BenefitsSection />
        <TestimonialsSection />
        
        {/* Minimal separator */}
        <div className="relative">
          <div className="flex justify-center">
            <div className="h-0.5 w-24 bg-gradient-to-r from-mansablue/20 via-mansablue to-mansablue/20"></div>
          </div>
        </div>
        
        <MansaMusaHistory />
        <FAQSection />
        
        {/* Very compact VisualDivider */}
        <VisualDivider />
        
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
