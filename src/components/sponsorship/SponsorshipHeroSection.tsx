
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Globe, TrendingUp } from 'lucide-react';

interface SponsorshipHeroSectionProps {
  onContactPartnership: () => void;
}

const SponsorshipHeroSection: React.FC<SponsorshipHeroSectionProps> = ({ onContactPartnership }) => {
  const handleBecomePartner = () => {
    const formElement = document.getElementById('sponsorship-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewTiers = () => {
    const tiersElement = document.getElementById('sponsorship-tiers');
    if (tiersElement) {
      tiersElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-28 md:py-40 overflow-hidden">
      {/* Multi-layer gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mansagold/25 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-600/15 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
      
      {/* Animated luxury particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#A78BFA' : '#60A5FA',
            }}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '110%',
              opacity: 0 
            }}
            animate={{ 
              y: '-10%',
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Geometric accent lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mansagold/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mansagold/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mansagold/10 border border-mansagold/30 mb-10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-mansagold" />
              <span className="text-sm font-semibold text-mansagold tracking-wider uppercase">
                Fortune 500 Partnership Program
              </span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="text-white">Invest in </span>
            <span className="text-gradient-gold">Legacy.</span>
            <br />
            <span className="text-white">Build </span>
            <span className="text-gradient-gold">Empire.</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-blue-100/80 mb-12 max-w-3xl mx-auto leading-relaxed font-body"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Align your brand with the largest AI-powered Black business ecosystem. 
            Create measurable economic impact while reaching an engaged, purpose-driven audience.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              size="lg"
              className="group bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-500 hover:via-yellow-500 hover:to-orange-500 text-slate-900 font-bold text-lg px-10 py-7 rounded-2xl shadow-2xl shadow-mansagold/30 hover:shadow-mansagold/40 transition-all duration-300 hover:scale-105"
              onClick={handleBecomePartner}
            >
              Become a Partner
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-semibold text-lg px-10 py-7 rounded-2xl backdrop-blur-sm transition-all duration-300"
              onClick={handleViewTiers}
            >
              View Partnership Tiers
            </Button>
          </motion.div>
          
          {/* Value proposition cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {[
              { icon: Globe, label: '6 Global Markets', sublabel: 'US, UK, Ghana & more' },
              { icon: TrendingUp, label: '100K+ Businesses', sublabel: 'Growing ecosystem' },
              { icon: Shield, label: 'Patent Pending', sublabel: 'Proprietary AI tech' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 px-5 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.03, borderColor: 'rgba(212, 175, 55, 0.3)' }}
              >
                <div className="w-10 h-10 rounded-lg bg-mansagold/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-mansagold" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">{item.label}</p>
                  <p className="text-blue-200/50 text-xs">{item.sublabel}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            className="pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-xs text-blue-200/40 mb-5 uppercase tracking-[0.2em]">
              Trusted by industry leaders across
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {['Financial Services', 'Technology', 'Healthcare', 'Real Estate', 'Retail'].map((sector, i) => (
                <motion.span 
                  key={i} 
                  className="text-white/30 font-semibold text-sm tracking-widest uppercase"
                  whileHover={{ color: 'rgba(212, 175, 55, 0.6)' }}
                >
                  {sector}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipHeroSection;
