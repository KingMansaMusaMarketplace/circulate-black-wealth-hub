
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
import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import VoiceInterface from '@/components/VoiceInterface';
import { SmartRecommendations } from '@/components/SmartRecommendations';
import { ContextualRecommendations } from '@/components/discovery/ContextualRecommendations';
import ShareButton from '@/components/ShareButton';

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
      description: 'Customers always FREE! Businesses FREE until Feb 28, 2026. Join the Mansa Musa Marketplace community and build wealth together.',
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        
        {/* Sponsor Banner */}
        <SectionErrorBoundary sectionName="Sponsor Banner">
          <SponsorBanner />
        </SectionErrorBoundary>
        
        {/* Hero Section */}
        <SectionErrorBoundary sectionName="Hero">
          <Hero />
        </SectionErrorBoundary>

        {/* Vibrant Welcome Banner */}
        <SectionErrorBoundary sectionName="Welcome Banner">
          <div className="relative -mt-20 z-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl h-40 shadow-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/50 to-blue-900/50" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="relative h-full flex items-center justify-between px-6 sm:px-8">
                  <div className="text-white z-10">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 drop-shadow-lg bg-gradient-to-r from-blue-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">Join the Movement! 🚀</h2>
                    <p className="text-blue-200 text-sm sm:text-base drop-shadow">Build wealth together in our growing community</p>
                  </div>
                  <div className="hidden md:flex items-center space-x-3 z-10">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white shadow-lg" />
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white shadow-lg" />
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-white shadow-lg" />
                    </div>
                    <p className="text-yellow-300 text-sm font-semibold">Goal: 1M Members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionErrorBoundary>

        {/* Free Growth Strategy Banner */}
        <SectionErrorBoundary sectionName="Growth Banner">
          <FreeGrowthBanner />
        </SectionErrorBoundary>

        {/* AI-Powered Smart Recommendations */}
        <SectionErrorBoundary sectionName="Smart Recommendations">
          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SmartRecommendations />
              </div>
              <div>
                <ContextualRecommendations />
              </div>
            </div>
          </div>
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
      
      {/* Floating Share Button */}
      <SectionErrorBoundary sectionName="Share Button">
        <ShareButton />
      </SectionErrorBoundary>
    </>
  );
};

export default HomePage;
