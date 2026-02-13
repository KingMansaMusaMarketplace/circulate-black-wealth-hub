
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-4 md:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-mansagold/10 via-amber-500/5 to-mansagold/10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-mansagold/20 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue rounded-3xl p-8 md:p-12 lg:p-16 text-center overflow-hidden border border-white/10">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-mansagold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/10 border border-mansagold/30 mb-6">
                  <Sparkles className="w-4 h-4 text-mansagold" />
                  <span className="text-sm font-medium text-mansagold">Join Our Community</span>
                </div>
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
                <span className="text-white">Ready to Start </span>
                <span className="text-gradient-gold">Circulating Wealth?</span>
              </h2>
              
              <p className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join our mission to reach 1 million members supporting Black-owned businesses 
                and creating generational economic impact.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="group bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-semibold text-lg px-8 py-6 rounded-xl shadow-lg shadow-mansagold/25 hover:shadow-xl hover:shadow-mansagold/30 transition-all duration-300"
                >
                  <Link to="/directory">
                    <Building2 className="mr-2 h-5 w-5" />
                    Explore Businesses
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8">
                <Link 
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 text-blue-200/70 hover:text-mansagold transition-colors font-bold text-xl md:text-2xl"
                >
                  Learn How It Works
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
