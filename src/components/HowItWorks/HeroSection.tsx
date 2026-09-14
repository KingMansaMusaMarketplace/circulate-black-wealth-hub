import React from 'react';
import { ChevronDown, ShoppingBag, Store } from 'lucide-react';
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

  const stats = [
    { value: '47,000+', label: 'Verified Businesses' },
    { value: '42', label: 'Agentic AI Employees' },
    { value: '46', label: 'Patent Claims Pending' },
    { value: '$12T', label: 'Global Black Economy' },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/40" />

      <div className="container-custom px-4 relative z-10">
        <ScrollReveal delay={0.1}>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border border-mansagold/40 bg-mansagold/10 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs font-semibold tracking-[0.18em] text-mansagold uppercase">How It Works</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-6 text-white">
              Find verified businesses. Earn as you spend. Watch the dollars circulate.
            </h1>

            <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-3xl">
              1325.AI is infrastructure for community wealth circulation — a verified directory, loyalty rails,
              and an agentic AI workforce working together. Here is exactly how it works for shoppers and for businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-mansagold text-black hover:bg-mansagold/90 font-semibold">
                <Link to="/directory">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Black-Owned
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto font-semibold border-2 border-white/25 bg-slate-900/60 text-white hover:bg-white/10">
                <Link to="/business/how-it-works">
                  <Store className="mr-2 h-5 w-5" />
                  For Businesses
                </Link>
              </Button>

              <AudioButton
                audioSrc={AUDIO_PATHS.blueprint}
                variant="red"
                size="lg"
                className="w-full sm:w-auto shadow-lg hover:shadow-xl"
              >
                Hear Our Blueprint
              </AudioButton>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} y={30}>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {stats.map((s) => (
              <div key={s.label} className="bg-slate-950/80 px-6 py-7">
                <div className="text-3xl md:text-4xl font-bold text-mansagold">{s.value}</div>
                <div className="mt-1 text-xs md:text-sm uppercase tracking-wider text-white/80">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/70">
            U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending
          </p>
        </ScrollReveal>
      </div>

      <button
        onClick={scrollToNextSection}
        className="mt-10 mx-auto text-white/80 hover:text-white flex flex-col items-center transition-colors z-20 relative"
        aria-label="Scroll to next section"
      >
        <span className="text-sm mb-1">Scroll to learn more</span>
        <ChevronDown className="animate-bounce" />
      </button>
    </section>
  );
};

export default HeroSection;
