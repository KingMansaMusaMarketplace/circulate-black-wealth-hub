
import React, { Suspense } from 'react';
import FeaturedBusinesses from '@/components/FeaturedBusinesses';
import CTASection from '@/components/CTASection';
import LazySection from '@/components/common/LazySection';
import { ImpactCounter } from './ImpactCounter';
import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import HowItWorksPreview from './HowItWorksPreview';
import BetaChallengeSection from './BetaChallengeSection';

const HomePageSections: React.FC = () => {
  return (
    <>
      {/* How It Works Preview */}
      <SectionErrorBoundary sectionName="How It Works Preview">
        <HowItWorksPreview />
      </SectionErrorBoundary>

      {/* Beta Challenge Section - 1M Goal */}
      <SectionErrorBoundary sectionName="Beta Challenge">
        <BetaChallengeSection />
      </SectionErrorBoundary>

      {/* Impact Counter */}
      <SectionErrorBoundary sectionName="Impact Counter">
        <ImpactCounter />
      </SectionErrorBoundary>

      {/* Featured Businesses - Limited to 6 */}
      <SectionErrorBoundary sectionName="Featured Businesses">
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
            <FeaturedBusinesses limit={6} />
          </Suspense>
        </LazySection>
      </SectionErrorBoundary>

      {/* CTA Section */}
      <SectionErrorBoundary sectionName="Call to Action">
        <section id="cta-section">
          <CTASection />
        </section>
      </SectionErrorBoundary>
    </>
  );
};

export default HomePageSections;
