import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';

interface PartnershipHeroProps {
  partnerName: string;
  partnerLogo?: string;
  headline: string;
  subheadline: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const PartnershipHero: React.FC<PartnershipHeroProps> = ({
  partnerName,
  partnerLogo,
  headline,
  subheadline,
  ctaText = "Schedule a Partnership Call",
  onCtaClick
}) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mansagold/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {/* Partner logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-6 mb-10"
        >
          {partnerLogo && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <img 
                  src={partnerLogo} 
                  alt={partnerName}
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </div>
              <span className="text-3xl md:text-4xl text-mansagold font-bold">+</span>
            </>
          )}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <img 
              src="/mmm-logo.png" 
              alt="1325.AI"
              className="h-12 md:h-16 w-auto object-contain"
            />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-5xl mx-auto leading-tight"
        >
          {headline.split('+').map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-mansagold">+</span>}
              {part}
            </React.Fragment>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-blue-200/80 max-w-3xl mx-auto mb-10"
        >
          {subheadline}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            size="lg"
            onClick={onCtaClick}
            className="bg-mansagold hover:bg-mansagold-dark text-slate-900 font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-mansagold/30 group"
          >
            <Calendar className="w-5 h-5 mr-2" />
            {ctaText}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Trust indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-sm text-blue-300/60"
        >
          Join the economic empowerment movement • Founding Partner Benefits until September 2026
        </motion.p>
      </div>
    </section>
  );
};

export default PartnershipHero;
