import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoirRideCTA: React.FC = () => {
  return (
    <section className="py-0 md:py-4 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-mansagold/5 via-transparent to-mansagold/5" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-black/90 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-mansagold/20 overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Content Side */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <Car className="h-9 w-9 text-mansagold" />
                <span className="text-mansagold font-bold text-3xl md:text-4xl uppercase tracking-wider">
                  Noir
                </span>
                <span className="text-white/60 font-light text-lg md:text-xl tracking-widest ml-1">
                  .travel
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                Tired of the 50% Take-Rate?{' '}
                <span className="text-mansagold">Switch to Noir.</span>
              </h2>
              
              <p className="text-base text-blue-200/70 mb-4">
                Flat 20% fee. Full fare transparency. Your driver keeps 80% — no algorithm games, no hidden math.
              </p>
              
              {/* Value Props */}
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>Human Appeals</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Star className="h-4 w-4 text-mansagold" />
                  <span>Favorite Driver</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Car className="h-4 w-4 text-mansagold" />
                  <span>Daily Payouts</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="bg-mansagold hover:bg-mansagold-dark text-slate-900 font-bold rounded-xl group"
                >
                  <Link to="/noir">
                    Request a Ride
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="border-mansagold/30 text-mansagold hover:bg-mansagold/10 rounded-xl"
                >
                  <Link to="/noir#drivers">
                    Become a Driver
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Image Side */}
            <div className="relative h-48 lg:h-auto min-h-[200px]">
              <div className="absolute inset-0 bg-gradient-to-br from-mansagold/10 via-black/30 to-black/60" />
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80"
                alt="Premium luxury ride service"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay gradient for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-transparent lg:to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NoirRideCTA;
