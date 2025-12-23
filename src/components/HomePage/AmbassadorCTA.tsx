import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, MapPin, ArrowRight, Sparkles } from 'lucide-react';

const AmbassadorCTA: React.FC = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-mansagold/20 via-mansagold/10 to-mansagold/20" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-mansagold/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-[80px]" />
      
      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-mansagold/30 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Icon/Badge */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-mansagold to-mansagold-dark flex items-center justify-center shadow-lg shadow-mansagold/30">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-mansagold" />
                <span className="text-mansagold font-semibold text-sm uppercase tracking-wide">
                  Earn While You Build
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Become a Mansa Ambassador
              </h2>
              
              <p className="text-lg text-white/80 mb-6 max-w-2xl">
                Earn money while building the largest Black business network in your city. 
                Join our ambassador program and turn your passion for community into income.
              </p>
              
              {/* Benefits */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/90">
                  <DollarSign className="w-5 h-5 text-mansagold" />
                  <span className="text-sm">10-15% Commission</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-5 h-5 text-mansagold" />
                  <span className="text-sm">6 Cities Recruiting</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Users className="w-5 h-5 text-mansagold" />
                  <span className="text-sm">Team Bonuses</span>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="flex-shrink-0">
              <Button
                asChild
                size="lg"
                className="bg-mansagold hover:bg-mansagold-dark text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-mansagold/30 group"
              >
                <Link to="/mansa-ambassadors">
                  Apply Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmbassadorCTA;
