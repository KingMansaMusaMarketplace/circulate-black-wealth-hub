
import React, { Suspense } from 'react';
import FeaturedBusinesses from '@/components/FeaturedBusinesses';
import CTASection from '@/components/CTASection';
import LazySection from '@/components/common/LazySection';
import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import HowItWorksPreview from './HowItWorksPreview';
import MissionPreview from './MissionPreview';

const HomePageSections: React.FC = () => {
  return (
    <>
      {/* How It Works Preview - 3 Simple Steps */}
      <SectionErrorBoundary sectionName="How It Works Preview">
        <HowItWorksPreview />
      </SectionErrorBoundary>

      {/* Mission Preview - Why This Matters */}
      <SectionErrorBoundary sectionName="Mission Preview">
        <MissionPreview />
      </SectionErrorBoundary>

      {/* Featured Businesses - Limited to 4 on mobile, 6 on desktop */}
      <SectionErrorBoundary sectionName="Featured Businesses">
        <LazySection threshold={0.2} rootMargin="100px">
          <Suspense fallback={
            <div className="py-12 md:py-16">
              <div className="max-w-7xl mx-auto px-4">
                <div className="animate-pulse space-y-6">
                  <div className="h-8 bg-white/10 rounded w-1/3 mx-auto"></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="space-y-3">
                        <div className="aspect-square bg-white/5 rounded-xl"></div>
                        <div className="h-4 bg-white/10 rounded"></div>
                        <div className="h-3 bg-white/5 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }>
            <FeaturedBusinesses limit={6} />
          </Suspense>
        </LazySection>
      </SectionErrorBoundary>

      {/* Simple CTA Section */}
      <SectionErrorBoundary sectionName="Call to Action">
        <section id="cta-section">
          <CTASection />
        </section>
      </SectionErrorBoundary>
    </>
  );
};

export default HomePageSections;
