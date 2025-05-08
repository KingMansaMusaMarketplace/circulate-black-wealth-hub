
import React, { useEffect } from 'react';
import HeroSection from '@/components/HowItWorks/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import CTASection from '@/components/HowItWorks/CTASection';
import PageNavigation from '@/components/HowItWorks/PageNavigation';

const HowItWorksPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'How It Works | Mansa Musa Marketplace';
  }, []);

  const navSections = [
    { id: 'hero', label: 'Overview' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'cta-section', label: 'Join Us' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <PageNavigation sections={navSections} />
      <HowItWorks />
      <CTASection />
    </div>
  );
};

export default HowItWorksPage;
