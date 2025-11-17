
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue-dark via-blue-800 to-blue-900"></div>
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-mansagold/20 to-amber-500/20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-mansagold/15 to-amber-400/15 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 text-white text-center border-2 border-white/30 shadow-2xl">
          <div className="relative">
            {/* Icon with gradient background */}
            <div className="inline-flex items-center justify-center mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-mansagold via-amber-500 to-yellow-500 shadow-xl animate-pulse">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="heading-lg mb-6 bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent font-extrabold">
              Join Us in Building Economic Infrastructure
            </h2>
            
            <p className="text-white/90 max-w-2xl mx-auto mb-10 text-xl md:text-2xl font-medium leading-relaxed">
              Be part of the movement that's creating intentional <span className="bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent font-bold">wealth circulation</span> for generations to come.
            </p>
            
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-mansagold via-amber-500 to-yellow-500 hover:from-amber-600 hover:via-yellow-600 hover:to-yellow-700 text-white px-10 py-7 text-xl font-bold group shadow-2xl hover:shadow-mansagold/50 transition-all duration-300 hover:scale-105 border-2 border-white/30">
                Get Early Access 
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            
            {/* Decorative elements */}
            <div className="mt-8 flex items-center justify-center gap-2 text-white/80">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              <span className="text-sm font-medium">No credit card required</span>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
