
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const scrollToNextSection = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      const yOffset = -100;
      const y = howItWorksSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-b from-mansablue to-mansablue-dark py-20 md:py-32 relative">
      <div className="container-custom px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-white mb-10 md:mb-0">
            <h1 className="heading-lg mb-6">How Mansa Musa Marketplace Works</h1>
            <p className="text-white/80 text-lg mb-8 max-w-xl">
              We're building more than an app — we're creating infrastructure for Black wealth circulation.
              Here's how you can be part of this economic movement.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-mansagold hover:bg-mansagold-dark text-white">
                Join Now
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative">
              <div className="bg-white rounded-xl shadow-xl p-4 rotate-3 transform hover:rotate-0 transition-transform duration-300">
                <div className="bg-gray-50 rounded-lg p-2">
                  <img 
                    src="/placeholder.svg" 
                    alt="Mansa Musa App Interface" 
                    className="w-full h-auto rounded" 
                    width="400"
                    height="300"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-mansagold text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold">
                Join 10,000+ users today!
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={scrollToNextSection}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white flex flex-col items-center transition-colors"
        aria-label="Scroll to next section"
      >
        <span className="text-sm mb-2">Scroll to learn more</span>
        <ChevronDown className="animate-bounce" />
      </button>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-auto"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
