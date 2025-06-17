
import React, { Suspense } from 'react';
import FeaturedBusinesses from '@/components/FeaturedBusinesses';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import VisualDivider from '@/components/HowItWorks/VisualDivider';
import { BenefitsSection } from '@/components/HowItWorks/Benefits';
import HowItWorksSteps from '@/components/HowItWorks/HowItWorksSteps';
import MansaMusaHistory from '@/components/HowItWorks/MansaMusaHistory';
import FAQSection from '@/components/HowItWorks/FAQSection';
import { SocialProofWidget } from '@/components/social-proof';
import LazySection from '@/components/common/LazySection';
import { 
  LazyInteractiveDemo, 
  LazyCirculationVisualization, 
  LazySponsorshipVideoSection 
} from '@/components/lazy';

const HomePageSections: React.FC = () => {
  return (
    <>
      {/* Social Proof Section */}
      <section id="social-proof">
        <SocialProofWidget />
      </section>

      {/* Interactive Demo Section */}
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

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorksSteps />
      </section>

      {/* Videos Section */}
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

      {/* Visual Divider */}
      <VisualDivider />

      {/* Money Flow Visualization */}
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

      {/* Benefits Section */}
      <section id="benefits">
        <BenefitsSection />
      </section>

      {/* Featured Businesses */}
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

      {/* Footer */}
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
    </>
  );
};

export default HomePageSections;
