
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/audio-button';
import { AUDIO_PATHS } from '@/utils/audio';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/animations/ScrollReveal';

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
    <section className="bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue py-20 md:py-28 relative overflow-hidden">
      {/* Enhanced Background with radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzZ6TTM2IDM4djJoMnYtMnptLTIgMHYyaDJ2LTJ6bTAgMnYyaDJ2LTJ6bS0yLTJ2Mmgydi0yem0wIDJ2Mmgydi0yem0tMi0ydjJoMnYtMnptMCAydjJoMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      
      <div className="container-custom px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <ScrollReveal delay={0.1}>
            <div className="md:w-1/2 text-white mb-8 md:mb-0">
            
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
                How <span className="bg-gradient-gold bg-clip-text text-transparent">Mansa Musa</span> Works
              </h1>
              <p className="font-body text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-xl">
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
                >
                  Learn More
                </Button>
              </div>
              
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-gold text-mansablue-dark hover:opacity-90 font-semibold shadow-2xl hover:shadow-mansagold/50 border-2 border-mansagold-light/30"
                >
                  Join Free Today
                </Button>
              </Link>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2} y={50}>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="relative w-full max-w-4xl">
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
                        <div className="font-display font-bold text-2xl bg-gradient-gold bg-clip-text text-transparent">10,000+</div>
                        <div className="font-body text-sm text-white/90">Active Users</div>
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
