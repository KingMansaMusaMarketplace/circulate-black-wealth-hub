
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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <HeroSection />
      
      {/* Add decorative pattern between hero and navigation */}
      <div className="bg-gray-50 py-2">
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
        
        {/* Add decorative element between sections */}
        <div className="py-4 bg-gray-50">
          <div className="container-custom">
            <div className="flex justify-center">
              <div className="h-0.5 w-24 bg-gradient-to-r from-mansagold/20 via-mansagold to-mansagold/20"></div>
            </div>
          </div>
        </div>
        
        <CirculationVisualization />
        
        {/* Add decorative pattern between sections */}
        <div className="py-4 bg-white">
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
        
        {/* Enhanced decorative transition before History section */}
        <div className="relative">
          {/* Add artistic wave pattern */}
          <div className="relative h-20">
            <div className="absolute w-full overflow-hidden h-20">
              <svg
                className="absolute bottom-0 w-full h-20 text-gray-50"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  className="fill-[#121212]"
                ></path>
              </svg>
            </div>
          </div>
          
          {/* Add decorative circles */}
          <div className="absolute -top-10 left-1/4 w-16 h-16 rounded-full bg-mansagold/5 blur-xl"></div>
          <div className="absolute -top-20 right-1/3 w-24 h-24 rounded-full bg-mansablue/5 blur-xl"></div>
        </div>
        
        <MansaMusaHistory />
        <FAQSection />
        
        {/* Enhanced transition between FAQ and CTA sections */}
        <div className="bg-white py-12 relative">
          <div className="container-custom">
            {/* Decorative pattern */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`h-1 rounded-full ${i === 1 ? 'w-12 bg-mansagold' : 'w-3 bg-mansagold/50'}`}></div>
                ))}
              </div>
            </div>
            
            {/* Added illustration/decoration */}
            <div className="flex justify-center">
              <div className="relative w-32 h-16">
                {/* Circle decoration */}
                <div className="absolute top-2 left-2 w-8 h-8 rounded-full border border-mansablue/30"></div>
                <div className="absolute bottom-0 right-10 w-10 h-10 rounded-full bg-mansagold/10"></div>
                
                {/* Arrow pattern suggesting circulation */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 60">
                  <path
                    d="M10,30 C10,10 50,10 60,30 C70,50 110,50 110,30"
                    fill="none"
                    stroke="#E5BB61"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                  <path
                    d="M100,30 L110,30 L105,38"
                    fill="none"
                    stroke="#E5BB61"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-5 pattern-dots pointer-events-none"></div>
          </div>
        </div>
        
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
