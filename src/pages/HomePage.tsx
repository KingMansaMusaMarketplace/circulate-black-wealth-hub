
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/navbar';
import HomePageSections from '@/components/HomePage/HomePageSections';
import FreeGrowthBanner from '@/components/FreeGrowthBanner';
import { trackBundleMetrics, addResourceHints } from '@/utils/dynamicImports';
import { preloadCriticalImages } from '@/utils/imageOptimizer';

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
    document.title = 'Mansa Musa Marketplace - Save Money & Support Black-Owned Businesses';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 
      'Join the FREE Mansa Musa Marketplace community! 100% free access for businesses and customers during our growth phase. Build community wealth together!'
    );

    // Preload critical chunks for better UX
    setTimeout(() => {
      import('@/pages/DirectoryPage');
      import('@/pages/LoginPage');
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
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
