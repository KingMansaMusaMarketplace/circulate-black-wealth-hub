import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import PageNavigation from '@/components/HowItWorks/PageNavigation';
import HomePageSections from '@/components/HomePage/HomePageSections';
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
      'Join thousands discovering amazing Black-owned businesses while earning rewards and building community wealth. Start FREE today!'
    );

    // Preload critical chunks for better UX
    setTimeout(() => {
      import('@/pages/DirectoryPage');
      import('@/pages/LoginPage');
    }, 2000);
  }, []);

  const navSections = [
    { id: 'hero', label: 'Overview' },
    { id: 'social-proof', label: 'Impact' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'videos', label: 'Videos' },
    { id: 'circulation-visualization', label: 'Money Flow' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'history', label: 'Our Story' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta-section', label: 'Join Us' }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero">
        <Hero />
      </section>

      {/* Page Navigation */}
      <PageNavigation sections={navSections} />

      {/* All other sections */}
      <HomePageSections />
    </div>
  );
};

export default HomePage;
