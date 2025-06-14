
import React, { useEffect, Suspense } from 'react';
import Hero from '@/components/Hero';
import FeaturedBusinesses from '@/components/FeaturedBusinesses';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/navbar';
import PageNavigation from '@/components/HowItWorks/PageNavigation';
import { BenefitsSection } from '@/components/HowItWorks/Benefits';
import HowItWorksSteps from '@/components/HowItWorks/HowItWorksSteps';
import MansaMusaHistory from '@/components/HowItWorks/MansaMusaHistory';
import FAQSection from '@/components/HowItWorks/FAQSection';
import VisualDivider from '@/components/HowItWorks/VisualDivider';
import { SocialProofWidget } from '@/components/social-proof';
import LazySection from '@/components/common/LazySection';
import { 
  LazyInteractiveDemo, 
  LazyCirculationVisualization, 
  LazySponsorshipVideoSection 
} from '@/components/lazy';
import { trackBundleMetrics, addResourceHints } from '@/utils/dynamicImports';

const HomePage = () => {
  useEffect(() => {
    // Track bundle performance
    trackBundleMetrics();
    
    // Add resource hints for better loading
    addResourceHints();
    
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
      
      {/* Hero Section - Critical, load immediately */}
      <section id="hero">
        <Hero />
      </section>

      {/* Page Navigation - Load immediately for UX */}
      <PageNavigation sections={navSections} />

      {/* Social Proof Section - High priority */}
      <section id="social-proof">
        <SocialProofWidget />
      </section>

      {/* Interactive Demo Section - Lazy loaded with higher threshold */}
      <LazySection threshold={0.3} rootMargin="150px">
        <Suspense fallback={
          <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-96 bg-gray-200 rounded-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        }>
          <LazyInteractiveDemo />
        </Suspense>
      </LazySection>

      {/* How It Works Section - Load early as it's important */}
      <section id="how-it-works">
        <HowItWorksSteps />
      </section>

      {/* Videos Section - Lazy loaded with generous margin */}
      <LazySection 
        threshold={0.1} 
        rootMargin="300px"
        className="section" 
        id="videos"
      >
        <Suspense fallback={
          <div className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="aspect-video bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-video bg-gray-200 rounded"></div>
                  <div className="aspect-video bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        }>
          <LazySponsorshipVideoSection />
        </Suspense>
      </LazySection>

      {/* Visual Divider - Lightweight, load normally */}
      <VisualDivider />

      {/* Money Flow Visualization - Heavy component, lazy load */}
      <LazySection 
        threshold={0.1} 
        rootMargin="200px"
        className="section" 
        id="circulation-visualization"
      >
        <Suspense fallback={
          <div className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        }>
          <LazyCirculationVisualization />
        </Suspense>
      </LazySection>

      {/* Benefits Section - Load early as it's conversion-focused */}
      <section id="benefits">
        <BenefitsSection />
      </section>

      {/* Featured Businesses - Lower priority, can be lazy loaded */}
      <LazySection threshold={0.2} rootMargin="100px">
        <Suspense fallback={
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="space-y-4">
                      <div className="aspect-square bg-gray-200 rounded-lg"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }>
          <FeaturedBusinesses />
        </Suspense>
      </LazySection>

      {/* Testimonials Section - Important for trust */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* Our Story / History Section */}
      <section id="history">
        <MansaMusaHistory />
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <FAQSection />
      </section>

      {/* CTA Section - High priority for conversions */}
      <section id="cta-section">
        <CTASection />
      </section>

      {/* Footer - Lazy load as it's at the bottom */}
      <LazySection threshold={0.1} rootMargin="50px">
        <Suspense fallback={
          <div className="bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-4 gap-8">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }>
          <Footer />
        </Suspense>
      </LazySection>
    </div>
  );
};

export default HomePage;
