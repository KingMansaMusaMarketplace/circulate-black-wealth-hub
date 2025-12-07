
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

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
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Premium gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue-dark via-mansablue to-mansablue-dark opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mansagold/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent" />
      
      {/* Animated gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-mansagold rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '100%',
              opacity: 0 
            }}
            animate={{ 
              y: '-10%',
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'linear',
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/10 border border-mansagold/30 mb-8">
              <Sparkles className="w-4 h-4 text-mansagold" />
              <span className="text-sm font-medium text-mansagold tracking-wide uppercase">
                Corporate Partnership Program
              </span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-white">Invest in </span>
            <span className="text-gradient-gold">Legacy.</span>
            <br />
            <span className="text-white">Build </span>
            <span className="text-gradient-gold">Impact.</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-blue-100/90 mb-10 max-w-3xl mx-auto leading-relaxed font-body"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Partner with Mansa Musa Marketplace to create lasting economic change 
            in Black communities while aligning your brand with authentic impact.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              size="lg"
              className="group bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-semibold text-lg px-8 py-6 rounded-xl shadow-lg shadow-mansagold/25 hover:shadow-xl hover:shadow-mansagold/30 transition-all duration-300"
              onClick={handleBecomePartner}
            >
              Become a Partner
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold text-lg px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
              onClick={handleViewTiers}
            >
              Explore Partnership Tiers
            </Button>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div 
            className="mt-16 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-sm text-blue-200/60 mb-4 uppercase tracking-widest">
              Trusted by industry leaders
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Fortune 500', 'Tech Giants', 'Financial Services', 'Retail Leaders'].map((partner, i) => (
                <span key={i} className="text-white/50 font-semibold text-lg tracking-wide">
                  {partner}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipHeroSection;
