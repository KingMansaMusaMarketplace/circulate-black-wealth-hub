import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0a1628] to-[#1a0d05]" />
      
      {/* Ambient effects with stronger gold presence */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-mansagold/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/8 rounded-full blur-[100px]" />
        {/* Gold radial spotlight behind headline with shimmer */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-mansagold/8 rounded-full blur-[150px]"
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Bottom gold edge transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-mansagold/5 to-transparent" />

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <motion.h1 
            className="font-playfair text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[1.05] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gradient-gold">Mansa Musa</span>
            <br />
            <span className="text-gradient-gold">Marketplace</span>
          </motion.h1>
          
          {/* Subhead */}
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-blue-100/80 mb-10 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Discover Black-owned businesses. Support your community. Build generational wealth together.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/directory">
              <Button 
                size="lg"
                className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold h-14 px-8 rounded-xl shadow-xl text-lg w-full sm:w-auto"
              >
                Explore Businesses
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link to="/how-it-works">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 font-semibold h-14 px-8 rounded-xl text-lg w-full sm:w-auto"
              >
                How It Works
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
