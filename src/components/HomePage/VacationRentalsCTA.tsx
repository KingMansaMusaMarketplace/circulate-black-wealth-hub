import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, Shield, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

const VacationRentalsCTA: React.FC = () => {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-mansagold/5 via-transparent to-mansagold/5" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Content Side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <Home className="h-5 w-5 text-mansagold" />
                <span className="text-mansagold font-medium text-sm uppercase tracking-wider">
                  Mansa Stays
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Book Vacation Rentals from{' '}
                <span className="text-mansagold">'Non-Bias'</span> Property Owners
              </h2>
              
              <p className="text-lg text-blue-200/70 mb-6">
                Discover unique stays with hosts who welcome everyone. Our marketplace ensures fair treatment and memorable experiences.
              </p>
              
              {/* Value Props */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>Verified Hosts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Percent className="h-4 w-4 text-mansagold" />
                  <span>92.5% Host Payouts</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-mansagold hover:bg-mansagold-dark text-slate-900 font-bold rounded-xl group"
                >
                  <Link to="/stays">
                    Browse Stays
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 rounded-xl"
                >
                  <Link to="/stays/list-property">
                    List Your Property
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Image Side */}
            <div className="relative h-64 lg:h-auto min-h-[300px]">
              <div className="absolute inset-0 bg-gradient-to-br from-mansagold/20 via-blue-600/20 to-slate-900/50" />
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                alt="Beautiful vacation rental property"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay gradient for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-900/80 lg:via-transparent lg:to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VacationRentalsCTA;
