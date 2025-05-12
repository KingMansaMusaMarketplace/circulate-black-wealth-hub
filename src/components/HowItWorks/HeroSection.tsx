
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/audio-button';
import { AUDIO_PATHS } from '@/utils/audio';
import { Link } from 'react-router-dom';

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
    <section className="bg-gradient-to-b from-mansablue to-mansablue-dark py-16 md:py-20 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute top-40 right-20 w-72 h-72 rounded-full bg-mansagold/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-56 h-56 rounded-full bg-white/5 blur-3xl"></div>
        
        {/* Small decorative circles */}
        <div className="absolute top-32 right-1/4 w-6 h-6 rounded-full bg-mansagold/30"></div>
        <div className="absolute bottom-40 left-32 w-4 h-4 rounded-full bg-white/20"></div>
        <div className="absolute top-1/2 right-16 w-3 h-3 rounded-full bg-mansagold/20"></div>
      </div>
      
      <div className="container-custom px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-white mb-8 md:mb-0 relative">
            {/* Small decorative element */}
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full border border-mansagold/30 hidden md:block"></div>
            
            <h1 className="heading-lg mb-5">How Mansa Musa Marketplace Works</h1>
            <p className="text-white/80 text-lg mb-6 max-w-xl">
              We're building more than an app — we're creating infrastructure for Black wealth circulation.
              Here's how you can be part of this economic movement.
            </p>
            
            <AudioButton 
              audioSrc={AUDIO_PATHS.blueprint}
              className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg mb-4 w-full md:w-auto"
            >
              Hear Our Blueprint
            </AudioButton>
            
            <div className="flex flex-wrap gap-4 relative z-20">
              <Link to="/signup">
                <Button size="lg" className="bg-mansagold hover:bg-mansagold-dark text-white relative z-10">
                  Join Now
                </Button>
              </Link>
              <Link to="#how-it-works" onClick={scrollToNextSection}>
                <Button variant="outline" size="lg" className="border-mansagold bg-mansagold/20 text-mansagold hover:bg-mansagold/30 relative z-10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative z-10">
              {/* Image with Black women on bed with laptop */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-mansagold/20 rounded-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-mansablue-light/30 rounded-xl"></div>
              
              <div className="bg-white rounded-xl shadow-xl p-4 rotate-3 transform hover:rotate-0 transition-transform duration-300 relative z-10">
                <div className="bg-gray-50 rounded-lg p-2">
                  <img 
                    src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                    alt="Black women sitting on a bed using a laptop" 
                    className="w-full h-auto rounded" 
                    width="400"
                    height="300"
                    style={{ minHeight: "220px", objectFit: "cover" }}
                  />
                  <div className="mt-2 p-2 border-t border-gray-100">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-mansagold text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold z-20">
                Join 10,000+ users today!
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={scrollToNextSection}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white flex flex-col items-center transition-colors z-20"
        aria-label="Scroll to next section"
      >
        <span className="text-sm mb-1">Scroll to learn more</span>
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
