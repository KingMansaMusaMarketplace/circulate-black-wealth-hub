import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface SponsorshipHeroSectionProps {
  onContactPartnership: () => void;
}

const SponsorshipHeroSection: React.FC<SponsorshipHeroSectionProps> = ({ onContactPartnership }) => {
  const handleRequestBrief = () => {
    document.getElementById('sponsorship-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewTiers = () => {
    document.getElementById('sponsorship-tiers')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-32 md:py-44 overflow-hidden">
      {/* Pure black base */}
      <div className="absolute inset-0 bg-[#000000]" />
      {/* Single, quiet gold radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,_rgba(212,175,55,0.10),_transparent_70%)]" />

      {/* Hairline gold rules top/bottom */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mansagold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mansagold/15 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] md:text-xs font-semibold text-mansagold tracking-[0.35em] uppercase mb-8"
          >
            Corporate Partnerships · 1325.AI
          </motion.p>

          <motion.h1
            className="font-playfair text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white mb-8 leading-[1.05]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Invest in the infrastructure of
            <br />
            <span className="text-gradient-gold">Black economic circulation.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/70 mb-14 max-w-2xl mx-auto leading-relaxed font-body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Patent-pending technology. A 33-agent AI workforce. A verified national network of
            Black-owned businesses. Partner with the platform building the rails of a $1.8T economy.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="group bg-mansagold hover:bg-mansagold/90 text-slate-900 font-semibold text-base px-8 py-6 rounded-md shadow-[0_0_40px_-10px_rgba(212,175,55,0.5)] transition-all"
              onClick={handleRequestBrief}
            >
              Request Partnership Brief
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border border-white/20 text-white hover:bg-white/5 hover:border-white/40 font-medium text-base px-8 py-6 rounded-md transition-all"
              onClick={handleViewTiers}
            >
              View Engagement Tiers
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-[11px] md:text-xs text-white/40 tracking-[0.2em] uppercase"
          >
            U.S. Patent Pending 63/969,202 · Verified Corporation · HBCU Partner Network
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipHeroSection;
