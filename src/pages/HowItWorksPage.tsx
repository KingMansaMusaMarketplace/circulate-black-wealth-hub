
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/audio-button';
import { AUDIO_PATHS } from '@/utils/audio';
import { ArrowLeft } from 'lucide-react';
import HeroSection from '@/components/HowItWorks/HeroSection';
import BenefitsSection from '@/components/HowItWorks/BenefitsSection';
import CTASection from '@/components/HowItWorks/CTASection';

const HowItWorksPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'How It Works | Mansa Musa Marketplace';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <BenefitsSection />
      <CTASection />
    </div>
  );
};

export default HowItWorksPage;
