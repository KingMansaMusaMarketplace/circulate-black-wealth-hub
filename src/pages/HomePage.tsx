
import React, { useEffect } from 'react';
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

const HomePage = () => {
  useEffect(() => {
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

      {/* Social Proof Section */}
      <section id="social-proof">
        <SocialProofWidget />
      </section>

      {/* Interactive Demo Section - Lazy Loaded */}
      <LazySection threshold={0.2} rootMargin="200px">
        <LazyInteractiveDemo />
      </LazySection>

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorksSteps />
      </section>

      {/* Videos Section - Lazy Loaded */}
      <LazySection 
        threshold={0.1} 
        rootMargin="300px"
        className="section" 
        id="videos"
      >
        <LazySponsorshipVideoSection />
      </LazySection>

      {/* Visual Divider */}
      <VisualDivider />

      {/* Money Flow Visualization - Lazy Loaded */}
      <LazySection 
        threshold={0.1} 
        rootMargin="200px"
        className="section" 
        id="circulation-visualization"
      >
        <LazyCirculationVisualization />
      </LazySection>

      {/* Benefits Section */}
      <section id="benefits">
        <BenefitsSection />
      </section>

      {/* Featured Businesses */}
      <FeaturedBusinesses />

      {/* Testimonials Section */}
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

      {/* CTA Section */}
      <section id="cta-section">
        <CTASection />
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
