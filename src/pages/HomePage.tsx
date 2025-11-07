
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import HomePageSections from '@/components/HomePage/HomePageSections';
import FreeGrowthBanner from '@/components/FreeGrowthBanner';
import { SponsorBanner } from '@/components/sponsors';
import { PublicSponsorDisplay } from '@/components/sponsors/PublicSponsorDisplay';
import { trackBundleMetrics, addResourceHints } from '@/utils/dynamicImports';
import { preloadCriticalImages } from '@/utils/imageOptimizer';
import { updateMetaTags } from '@/utils/seoUtils';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { NativeFeaturesPromo } from '@/components/NativeFeaturesPromo';
import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import VoiceInterface from '@/components/VoiceInterface';

const HomePage = () => {
  const { shouldShowTour, tourSteps, tourKey, completeTour, skipTour } = useOnboardingTour();
  
  useEffect(() => {
    // Track bundle performance
    trackBundleMetrics();
    
    // Add resource hints for better loading
    addResourceHints();
    
    // Preload critical images
    const criticalImages = [
      '/lovable-uploads/hero-image.jpg',
      '/lovable-uploads/logo.png'
    ];
    preloadCriticalImages(criticalImages);
    
    // SEO optimizations
    updateMetaTags({
      title: 'Mansa Musa Marketplace - Save Money & Support Black-Owned Businesses',
      description: 'Customers always FREE! Businesses FREE until Jan 2026. Join the Mansa Musa Marketplace community and build wealth together.',
      path: '/'
    });

    // Preload critical chunks for better UX (reduced delay for faster interactivity)
    setTimeout(() => {
      // Temporarily disabled to avoid iOS white screen during startup
      // import('@/pages/DirectoryPage');
      import('@/pages/LoginPage');
    }, 1000);
  }, []);

  return (
    <>
      <div className="min-h-screen">
        {/* Sponsor Banner */}
        <SectionErrorBoundary sectionName="Sponsor Banner">
          <SponsorBanner />
        </SectionErrorBoundary>
        
        {/* Hero Section */}
        <SectionErrorBoundary sectionName="Hero">
          <Hero />
        </SectionErrorBoundary>

        {/* Native Features Promo for App Store Review */}
        <SectionErrorBoundary sectionName="Native Features">
          <NativeFeaturesPromo />
        </SectionErrorBoundary>

        {/* Free Growth Strategy Banner */}
        <SectionErrorBoundary sectionName="Growth Banner">
          <FreeGrowthBanner />
        </SectionErrorBoundary>

        {/* All conversion-focused sections */}
        <SectionErrorBoundary sectionName="Content Sections">
          <HomePageSections />
        </SectionErrorBoundary>
        
        {/* Public Sponsor Display */}
        <SectionErrorBoundary sectionName="Sponsor Showcase">
          <PublicSponsorDisplay />
        </SectionErrorBoundary>
      </div>
      
      {/* Voice Interface */}
      <SectionErrorBoundary sectionName="Voice Assistant">
        <VoiceInterface />
      </SectionErrorBoundary>
      
      {shouldShowTour && (
        <SectionErrorBoundary sectionName="Onboarding Tour">
          <OnboardingTour
            steps={tourSteps}
            tourKey={tourKey}
            onComplete={completeTour}
            onSkip={skipTour}
          />
        </SectionErrorBoundary>
      )}
    </>
  );
};

export default HomePage;
