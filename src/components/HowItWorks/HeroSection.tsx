import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/audio-button';
import { AUDIO_PATHS } from '@/utils/audio';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { shouldHideStripePayments } from '@/utils/platform-utils';

const HeroSection = () => {
  const isIOS = shouldHideStripePayments();
  const scrollToNextSection = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      const yOffset = -100;
      const y = howItWorksSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/5" />
      
      <div className="container-custom px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <ScrollReveal delay={0.1}>
            <div className="lg:w-2/5 text-white mb-8 lg:mb-0">
            
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
                How <span className="bg-gradient-gold bg-clip-text text-transparent">Mansa Musa</span> Works
              </h1>
              <p className="font-body text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl">
                We're building more than an app — we're creating infrastructure for Black wealth circulation.
                Here's how you can be part of this economic movement.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <AudioButton 
                  audioSrc={AUDIO_PATHS.blueprint}
                  variant="red"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg hover:shadow-xl"
                >
                  Hear Our Blueprint
                </AudioButton>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto font-semibold border-2 border-white/30 text-white hover:bg-white/10 shadow-lg"
                  onClick={scrollToNextSection}
                  style={{ touchAction: 'manipulation' }}
                >
                  <span className="pointer-events-none">Learn More</span>
                </Button>
              </div>
              
              {!isIOS && (
                <Link to="/signup" style={{ touchAction: 'manipulation' }}>
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-gold text-mansablue-dark hover:opacity-90 font-semibold shadow-2xl hover:shadow-mansagold/50 border-2 border-mansagold-light/30"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span className="pointer-events-none">Join Free Today</span>
                  </Button>
                </Link>
              )}
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2} y={50}>
            <div className="lg:w-2/3 flex justify-center lg:justify-end">
              <div className="relative w-full scale-150 lg:scale-[1.8] origin-center">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20 rounded-3xl"></div>
                
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <img 
                    src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                    alt="Community members using the Mansa Musa Marketplace" 
                    className="w-full h-auto object-cover"
                  />
                  
                  {/* Glass overlay badge */}
                  <div className="absolute bottom-4 left-4 right-4 glass-card backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <div className="font-display font-bold text-2xl bg-gradient-gold bg-clip-text text-transparent">1M Goal</div>
                        <div className="font-body text-sm text-white/90">Join the Mission</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-bold text-2xl text-green-400">100%</div>
                        <div className="font-body text-sm text-white/90">FREE</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
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
