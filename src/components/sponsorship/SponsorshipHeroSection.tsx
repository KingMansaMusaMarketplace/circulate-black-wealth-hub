
import React from 'react';
import { Button } from '@/components/ui/button';
import VerifiedCorporationBadge from '@/components/ui/VerifiedCorporationBadge';

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
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12">
            <div className="text-center mb-8">
              <VerifiedCorporationBadge variant="compact" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
              Corporate Sponsorship
            </h1>
            
            <p className="text-xl text-blue-200 text-center mb-8 leading-relaxed">
              Partner with us to support Black-owned businesses and create meaningful economic impact in communities nationwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                onClick={handleBecomePartner}
              >
                Become a Partner
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                onClick={handleViewTiers}
              >
                View Sponsorship Tiers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorshipHeroSection;
