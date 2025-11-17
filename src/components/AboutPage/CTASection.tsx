
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600"></div>
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-400/30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-400/30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-rose-400/20 to-pink-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container-custom relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 text-white text-center border-2 border-white/30 shadow-2xl">
          <div className="relative">
            {/* Icon with gradient background */}
            <div className="inline-flex items-center justify-center mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 shadow-xl animate-pulse">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="heading-lg mb-6 bg-gradient-to-r from-yellow-200 via-amber-100 to-orange-200 bg-clip-text text-transparent font-extrabold">
              Join Us in Building Economic Infrastructure
            </h2>
            
            <p className="text-white/90 max-w-2xl mx-auto mb-10 text-xl md:text-2xl font-medium leading-relaxed">
              Be part of the movement that's creating intentional <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent font-bold">wealth circulation</span> for generations to come.
            </p>
            
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-500 hover:via-amber-600 hover:to-orange-600 text-white px-10 py-7 text-xl font-bold group shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 border-2 border-white/30">
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
