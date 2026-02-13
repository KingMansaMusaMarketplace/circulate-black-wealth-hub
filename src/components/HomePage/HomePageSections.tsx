import React, { Suspense, lazy } from 'react';
import LazySection from '@/components/common/LazySection';
import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';

// Lazy load all non-critical sections
const FeaturedBusinesses = lazy(() => import('@/components/FeaturedBusinesses'));
const CTASection = lazy(() => import('@/components/CTASection'));

const MissionPreview = lazy(() => import('./MissionPreview'));
const ThreePillars = lazy(() => import('./ThreePillars'));
const VacationRentalsCTA = lazy(() => import('./VacationRentalsCTA'));
const CirculationGap = lazy(() => import('./CirculationGap'));

// Skeleton fallback for sections
const SectionSkeleton = ({ height = "h-32" }: { height?: string }) => (
  <div className={`py-2 md:py-8 ${height}`}>
    <div className="max-w-7xl mx-auto px-4">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-white/10 rounded w-1/3 mx-auto"></div>
        <div className="h-4 bg-white/5 rounded w-2/3 mx-auto"></div>
      </div>
    </div>
  </div>
);

const BusinessSkeleton = () => (
  <div className="py-3 md:py-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-white/10 rounded w-1/3 mx-auto"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HomePageSections: React.FC = () => {
  return (
    <>
      {/* Mission Preview */}
      <SectionErrorBoundary sectionName="Mission Preview">
        <LazySection threshold={0.1} rootMargin="200px">
          <Suspense fallback={<SectionSkeleton height="h-24" />}>
            <MissionPreview />
          </Suspense>
        </LazySection>
      </SectionErrorBoundary>

      {/* Vacation Rentals CTA - Mansa Stays promotion */}
      <SectionErrorBoundary sectionName="Vacation Rentals CTA">
        <LazySection threshold={0.1} rootMargin="200px">
          <Suspense fallback={<SectionSkeleton height="h-48" />}>
            <VacationRentalsCTA />
          </Suspense>
        </LazySection>
      </SectionErrorBoundary>

      {/* Three Pillars */}
      <SectionErrorBoundary sectionName="Three Pillars">
        <Suspense fallback={<SectionSkeleton />}>
          <ThreePillars />
        </Suspense>
      </SectionErrorBoundary>

      {/* Featured Businesses */}
      <SectionErrorBoundary sectionName="Featured Businesses">
        <Suspense fallback={<BusinessSkeleton />}>
          <FeaturedBusinesses limit={3} />
        </Suspense>
      </SectionErrorBoundary>

      {/* CTA Section */}
      <SectionErrorBoundary sectionName="Call to Action">
        <Suspense fallback={<SectionSkeleton height="h-32" />}>
          <section id="cta-section">
            <CTASection />
          </section>
        </Suspense>
      </SectionErrorBoundary>

      {/* Circulation Gap - After CTA */}
      <SectionErrorBoundary sectionName="Circulation Gap">
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <CirculationGap />
        </Suspense>
      </SectionErrorBoundary>
    </>
  );
};

export default HomePageSections;
