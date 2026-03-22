
import React, { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import HomePageSections from '@/components/HomePage/HomePageSections';

import { SponsorBanner } from '@/components/sponsors';
import { PublicSponsorDisplay } from '@/components/sponsors/PublicSponsorDisplay';
import { trackBundleMetrics, addResourceHints } from '@/utils/dynamicImports';
import { preloadCriticalImages } from '@/utils/imageOptimizer';
import { updateMetaTags, pageSEO } from '@/utils/seoUtils';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import VoiceInterface from '@/components/VoiceInterface';
import { useQueryClient } from '@tanstack/react-query';

import { OrganizationStructuredData } from '@/components/SEO/OrganizationStructuredData';
import { WebsiteStructuredData } from '@/components/SEO/WebsiteStructuredData';

const HomePage = () => {
  const { shouldShowTour, tourSteps, tourKey, completeTour, skipTour } = useOnboardingTour();
  const queryClient = useQueryClient();
  const [showRefreshBar, setShowRefreshBar] = useState(true);
  const [animationKey] = useState(() => Date.now());
  
  useEffect(() => {
    // Brief refresh indicator
    const timer = setTimeout(() => setShowRefreshBar(false), 600);
    
    // Force fresh data on mount
    queryClient.invalidateQueries();

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
      title: pageSEO.home.title,
      description: pageSEO.home.description,
      path: '/',
      keywords: pageSEO.home.keywords,
    });

    // Preload critical chunks for better UX
    setTimeout(() => {
      import('@/pages/LoginPage');
    }, 1000);

    return () => clearTimeout(timer);
  }, [queryClient]);

  return (
    <>
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      
      {/* Refresh loading indicator */}
      {showRefreshBar && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
          <div className="h-full bg-gradient-to-r from-mansagold via-amber-400 to-mansagold origin-left"
               style={{ animation: 'shimmer 0.6s ease-out forwards' }} />
          <style>{`
            @keyframes shimmer {
              0% { transform: scaleX(0); opacity: 1; }
              80% { transform: scaleX(1); opacity: 1; }
              100% { transform: scaleX(1); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      <div className="min-h-screen relative overflow-hidden">
        {/* Modern dark gradient mesh background - matching directory page */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]" />
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-tr from-blue-700/25 to-mansablue/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-bl from-mansagold/20 to-amber-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        {/* Subtle gold accent line at top */}
        <div className="h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent opacity-60 relative z-10" />
        
        {/* Sponsor Banner */}
        <SectionErrorBoundary sectionName="Sponsor Banner">
          <SponsorBanner />
        </SectionErrorBoundary>
        
        {/* Hero Section - key forces animation replay on refresh */}
        <SectionErrorBoundary sectionName="Hero">
          <Hero key={animationKey} />
        </SectionErrorBoundary>

        {/* Essential Sections Only */}
        <SectionErrorBoundary sectionName="Content Sections">
          <HomePageSections />
        </SectionErrorBoundary>

        {/* Public Sponsor Display */}
        <SectionErrorBoundary sectionName="Sponsor Showcase">
          <PublicSponsorDisplay />
        </SectionErrorBoundary>
      </div>
      
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
