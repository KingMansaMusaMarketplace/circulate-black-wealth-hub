
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-16 md:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Large blurred circles for depth */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Smaller decorative elements */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 flex space-x-20">
          <div className="w-3 h-3 rounded-full bg-amber-400/60 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-purple-400/60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-3 h-3 rounded-full bg-pink-400/60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="absolute bottom-10 left-10 opacity-30">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="39" stroke="url(#gradient1)" strokeWidth="2" />
            <defs>
              <linearGradient id="gradient1" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="absolute top-10 right-10 opacity-30">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="58" height="58" stroke="url(#gradient2)" strokeWidth="2" />
            <defs>
              <linearGradient id="gradient2" x1="0" y1="0" x2="60" y2="60">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      <div className="container-custom px-4">
        <div className="max-w-3xl mx-auto text-center relative">
          {/* Small decorative element above heading */}
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 mx-auto mb-8 rounded-full shadow-lg"></div>
          
          <h1 className="heading-lg text-white mb-6 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent animate-fade-in">
            Building the Future of Black Wealth Circulation
          </h1>
          <p className="text-white/90 text-lg mb-10 relative leading-relaxed font-medium">
            Mansa Musa Marketplace was never designed as just an app. It's the infrastructure blueprint for circulating 
            Black dollars intentionally, systemically, and sustainably across generations.
            
            {/* Small decorative element */}
            <span className="absolute -right-4 -top-4 w-10 h-10 border-2 border-amber-400/50 rounded-full hidden md:block animate-pulse"></span>
          </p>
          <div className="flex justify-center relative">
            {/* Subtle glow effect under button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-16 bg-gradient-to-r from-amber-500/40 to-orange-500/40 rounded-full blur-xl"></div>
            
            <Link to="/how-it-works">
              <Button className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white px-10 py-7 text-lg font-bold group relative z-10 shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105">
                Learn How It Works
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {/* Small decorative dots below */}
          <div className="flex justify-center mt-12 space-x-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"></div>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
