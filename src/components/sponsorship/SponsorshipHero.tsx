
import React from 'react';
import { Button } from '@/components/ui/button';

const SponsorshipHero = () => {
  return (
    <div className="bg-gradient-to-r from-mansablue to-mansablue-dark text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Corporate Sponsorship Program</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Partner with Mansa Musa Marketplace and make a lasting impact on Black economic empowerment while gaining valuable visibility for your brand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-white text-mansablue hover:bg-white/90 text-lg px-8 py-6"
              onClick={() => document.getElementById('sponsorship-form')?.scrollIntoView({behavior: 'smooth'})}
            >
              Become a Sponsor
            </Button>
            <Button 
              variant="outline" 
              className="border-mansagold bg-mansagold text-white hover:bg-mansagold-dark text-lg px-8 py-6"
              onClick={() => document.getElementById('sponsorship-tiers')?.scrollIntoView({behavior: 'smooth'})}
            >
              View Sponsorship Tiers
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipHero;
