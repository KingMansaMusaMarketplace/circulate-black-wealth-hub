import React, { useEffect } from 'react';
import NativeHero from '@/components/mobile/NativeHero';
import NativeFeaturedBusinesses from '@/components/mobile/NativeFeaturedBusinesses';
import NativeCategories from '@/components/mobile/NativeCategories';
import { trackBundleMetrics, addResourceHints } from '@/utils/dynamicImports';
import { preloadCriticalImages } from '@/utils/imageOptimizer';
import { updateMetaTags } from '@/utils/seoUtils';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { Capacitor } from '@capacitor/core';

const HomePage = () => {
  const { shouldShowTour, tourSteps, tourKey, completeTour, skipTour } = useOnboardingTour();
  const isNative = Capacitor.isNativePlatform();
  
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
      title: 'Mansa Musa Marketplace - Discover Black-Owned Businesses',
      description: 'Support local Black-owned businesses and earn rewards. Join our community building wealth together.',
      path: '/'
    });

    // Preload critical chunks for better UX
    setTimeout(() => {
      import('@/pages/LoginPage');
    }, 1000);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Native-First Design - Clean, Simple, App-Like */}
        <NativeHero />
        
        {/* Categories - Touch-Friendly Grid */}
        <NativeCategories />
        
        {/* Featured Businesses - Horizontal Scroll */}
        <NativeFeaturedBusinesses />
      </div>
      
      {shouldShowTour && (
        <OnboardingTour
          steps={tourSteps}
          tourKey={tourKey}
          onComplete={completeTour}
          onSkip={skipTour}
        />
      )}
    </>
  );
};

export default HomePage;
