
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import HomePageSections from '@/components/HomePage/HomePageSections';
import AmbassadorCTA from '@/components/HomePage/AmbassadorCTA';
import { SponsorBanner } from '@/components/sponsors';
import { PublicSponsorDisplay } from '@/components/sponsors/PublicSponsorDisplay';
import { trackBundleMetrics, addResourceHints } from '@/utils/dynamicImports';
import { preloadCriticalImages } from '@/utils/imageOptimizer';
import { updateMetaTags, pageSEO } from '@/utils/seoUtils';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import VoiceInterface from '@/components/VoiceInterface';
import ShareButton from '@/components/ShareButton';
import { OrganizationStructuredData } from '@/components/SEO/OrganizationStructuredData';
import { WebsiteStructuredData } from '@/components/SEO/WebsiteStructuredData';

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
      title: pageSEO.home.title,
      description: pageSEO.home.description,
      path: '/',
      keywords: pageSEO.home.keywords,
    });

    // Preload critical chunks for better UX
    setTimeout(() => {
      import('@/pages/LoginPage');
    }, 1000);
  }, []);

  return (
    <>
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a1628] via-mansablue-dark to-[#0a1628]">
        {/* Vibrant ambient background - boosted for iPhone visibility */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-mansagold/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/15 rounded-full blur-[80px]" />
        </div>
        
        {/* Sponsor Banner */}
        <SectionErrorBoundary sectionName="Sponsor Banner">
          <SponsorBanner />
        </SectionErrorBoundary>
        
        {/* Hero Section - Simplified with integrated Wealth Ticker */}
        <SectionErrorBoundary sectionName="Hero">
          <Hero />
        </SectionErrorBoundary>

        {/* Essential Sections Only */}
        <SectionErrorBoundary sectionName="Content Sections">
          <HomePageSections />
        </SectionErrorBoundary>

        {/* Ambassador Program CTA */}
        <SectionErrorBoundary sectionName="Ambassador CTA">
          <AmbassadorCTA />
        </SectionErrorBoundary>
        
        {/* Public Sponsor Display */}
        <SectionErrorBoundary sectionName="Sponsor Showcase">
          <PublicSponsorDisplay />
        </SectionErrorBoundary>
      </div>
      
      {/* Voice Interface - PRESERVED */}
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
      
      {/* Floating Share Button */}
      <SectionErrorBoundary sectionName="Share Button">
        <ShareButton />
      </SectionErrorBoundary>
    </>
  );
};

export default HomePage;
