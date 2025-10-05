
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import HomePageSections from '@/components/HomePage/HomePageSections';
import FreeGrowthBanner from '@/components/FreeGrowthBanner';
import { trackBundleMetrics, addResourceHints } from '@/utils/dynamicImports';
import { preloadCriticalImages } from '@/utils/imageOptimizer';
import { updateMetaTags } from '@/utils/seoUtils';

const HomePage = () => {
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
      description: 'Join the FREE Mansa Musa Marketplace community! 100% free access for businesses and customers during our growth phase. Build community wealth together!',
      path: '/'
    });

    // Preload critical chunks for better UX
    setTimeout(() => {
      import('@/pages/DirectoryPage');
      import('@/pages/LoginPage');
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Free Growth Strategy Banner */}
      <FreeGrowthBanner />

      {/* All conversion-focused sections */}
      <HomePageSections />
    </div>
  );
};

export default HomePage;
