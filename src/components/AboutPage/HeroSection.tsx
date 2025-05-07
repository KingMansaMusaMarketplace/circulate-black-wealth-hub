
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-mansablue-dark py-16 md:py-20 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Large blurred circles for depth */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-mansagold/10 blur-3xl"></div>
        
        {/* Smaller decorative elements */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 flex space-x-20">
          <div className="w-2 h-2 rounded-full bg-mansagold/40"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-mansagold/40"></div>
        </div>
        
        <div className="absolute bottom-10 left-10 opacity-20">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="39" stroke="currentColor" strokeWidth="2" className="text-white" />
          </svg>
        </div>
        
        <div className="absolute top-10 right-10 opacity-20">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="58" height="58" stroke="currentColor" strokeWidth="2" className="text-mansagold" />
          </svg>
        </div>
      </div>
      
      <div className="container-custom px-4">
        <div className="max-w-3xl mx-auto text-center relative">
          {/* Small decorative element above heading */}
          <div className="w-20 h-1 bg-mansagold mx-auto mb-8"></div>
          
          <h1 className="heading-lg text-white mb-5">Building the Future of Black Wealth Circulation</h1>
          <p className="text-white/80 text-lg mb-8 relative">
            Mansa Musa Marketplace was never designed as just an app. It's the infrastructure blueprint for circulating 
            Black dollars intentionally, systemically, and sustainably across generations.
            
            {/* Small decorative element */}
            <span className="absolute -right-4 -top-4 w-8 h-8 border border-mansagold/30 rounded-full hidden md:block"></span>
          </p>
          <div className="flex justify-center relative">
            {/* Subtle glow effect under button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-12 bg-mansagold/20 rounded-full blur-lg"></div>
            
            <Link to="/how-it-works">
              <Button className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg group relative z-10">
                Learn How It Works
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {/* Small decorative dots below */}
          <div className="flex justify-center mt-12 space-x-1">
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
            <div className="w-1 h-1 rounded-full bg-white/60"></div>
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
