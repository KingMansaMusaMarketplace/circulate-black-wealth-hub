
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-mansablue-dark py-16 md:py-20">
      <div className="container-custom px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="heading-lg text-white mb-5">Building the Future of Black Wealth Circulation</h1>
          <p className="text-white/80 text-lg mb-6">
            Mansa Musa Marketplace was never designed as just an app. It's the infrastructure blueprint for circulating 
            Black dollars intentionally, systemically, and sustainably across generations.
          </p>
          <div className="flex justify-center">
            <Link to="/how-it-works">
              <Button className="bg-mansagold hover:bg-mansagold-dark text-white px-8 py-6 text-lg group">
                Learn How It Works
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
