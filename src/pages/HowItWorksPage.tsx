
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
        
        {/* Enhanced decorative transition between FAQ and CTA sections - HEAVILY EXPANDED */}
        <div className="relative">
          {/* Add a decorative wave pattern */}
          <div className="w-full overflow-hidden h-24">
            <svg viewBox="0 0 1200 120" className="w-full h-24" preserveAspectRatio="none">
              <path 
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                className="fill-gray-50"
              ></path>
            </svg>
          </div>

          <div className="bg-gray-50 py-20 relative">
            <div className="container-custom">
              {/* Visual divider with animated gradient */}
              <div className="flex justify-center mb-10">
                <div className="h-0.5 w-40 bg-gradient-to-r from-mansablue/20 via-mansagold to-mansablue/20 animate-pulse"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="flex justify-center mb-8">
                <div className="relative w-64 h-32">
                  {/* Decorative elements representing circulation */}
                  <div className="absolute top-0 left-0 w-12 h-12 rounded-full border border-mansablue/30 animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-mansagold/10"></div>
                  <div className="absolute top-1/2 right-1/4 w-8 h-8 rounded-full bg-mansablue/10"></div>
                  
                  {/* Decorative circles */}
                  <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-mansagold/40"></div>
                  <div className="absolute bottom-4 left-10 w-2 h-2 rounded-full bg-mansablue/60"></div>
                  <div className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-mansagold/20"></div>
                  
                  {/* Arrow patterns suggesting circulation */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 240 120">
                    <path
                      d="M40,60 C40,30 100,30 120,60 C140,90 200,90 200,60"
                      fill="none"
                      stroke="#E5BB61"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                    <path
                      d="M190,60 L200,60 L195,68"
                      fill="none"
                      stroke="#E5BB61"
                      strokeWidth="2"
                    />
                    <path
                      d="M200,60 C170,60 170,40 140,40 C110,40 110,60 80,60"
                      fill="none"
                      stroke="#4267A0"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                      strokeOpacity="0.6"
                    />
                    <path
                      d="M90,60 L80,60 L85,53"
                      fill="none"
                      stroke="#4267A0"
                      strokeWidth="1.5"
                      strokeOpacity="0.6"
                    />
                  </svg>
                </div>
              </div>

              {/* Text flourish */}
              <div className="flex justify-center items-center mb-8">
                <div className="w-10 h-px bg-mansablue/30"></div>
                <div className="mx-4 text-mansablue-dark/70 italic text-sm">wealth circulation</div>
                <div className="w-10 h-px bg-mansablue/30"></div>
              </div>
              
              {/* Decorative pattern */}
              <div className="flex justify-center">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-mansablue/60"></div>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-mansagold/60 to-transparent"></div>
                  <div className="w-3 h-3 rounded-full border border-mansagold/60"></div>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-mansagold/60 to-transparent"></div>
                  <div className="w-2 h-2 rounded-full bg-mansablue/60"></div>
                </div>
              </div>
            </div>

            {/* Subtle background patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pattern-dots pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-mansagold/5 blur-3xl"></div>
            <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-mansablue/5 blur-3xl"></div>
          </div>
          
          {/* Bottom wave pattern leading to CTA */}
          <div className="w-full overflow-hidden h-24">
            <svg viewBox="0 0 1200 120" className="w-full h-24" preserveAspectRatio="none">
              <path 
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                className="fill-white rotate-180 translate-y-1"
              ></path>
            </svg>
          </div>
        </div>
        
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
