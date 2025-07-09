
import React from 'react';
import { Button } from '@/components/ui/button';

interface SponsorshipHeroSectionProps {
  onContactPartnership: () => void;
}

const SponsorshipHeroSection: React.FC<SponsorshipHeroSectionProps> = ({ onContactPartnership }) => {
  const handleBecomePartner = () => {
    const formElement = document.getElementById('sponsorship-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewTiers = () => {
    const tiersElement = document.getElementById('sponsorship-tiers');
    if (tiersElement) {
      tiersElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-r from-mansablue to-mansablue-dark py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Corporate Sponsorship
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          Partner with us to create meaningful economic impact while supporting Black-owned businesses 
          and strengthening communities across the nation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold"
            onClick={handleBecomePartner}
          >
            Become a Partner
          </Button>
          <Button 
            size="lg" 
            variant="white"
            className="font-semibold"
            onClick={handleViewTiers}
          >
            View Sponsorship Tiers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipHeroSection;
