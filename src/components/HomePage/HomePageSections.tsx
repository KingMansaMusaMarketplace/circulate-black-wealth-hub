import React, { Suspense, lazy } from 'react';
import LazySection from '@/components/common/LazySection';
import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';

// Lazy load all non-critical sections
const FeaturedBusinesses = lazy(() => import('@/components/FeaturedBusinesses'));
const CTASection = lazy(() => import('@/components/CTASection'));

const MissionPreview = lazy(() => import('./MissionPreview'));
const ThreePillars = lazy(() => import('./ThreePillars'));
const VacationRentalsCTA = lazy(() => import('./VacationRentalsCTA'));

// Skeleton fallback for sections
const SectionSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div className={`py-12 md:py-16 ${height}`}>
    <div className="max-w-7xl mx-auto px-4">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-white/10 rounded w-1/3 mx-auto"></div>
        <div className="h-4 bg-white/5 rounded w-2/3 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const BusinessSkeleton = () => (
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
);

const HomePageSections: React.FC = () => {
  return (
    <>
      {/* Mission Preview - Lazy loaded with viewport trigger */}
      <SectionErrorBoundary sectionName="Mission Preview">
        <LazySection threshold={0.1} rootMargin="200px">
          <Suspense fallback={<SectionSkeleton height="h-48" />}>
            <MissionPreview />
          </Suspense>
        </LazySection>
      </SectionErrorBoundary>


      {/* Three Pillars - Deferred */}
      <SectionErrorBoundary sectionName="Three Pillars">
        <LazySection threshold={0.15} rootMargin="150px">
          <Suspense fallback={<SectionSkeleton />}>
            <ThreePillars />
          </Suspense>
        </LazySection>
      </SectionErrorBoundary>

      {/* Vacation Rentals CTA - Mansa Stays promotion */}
      <SectionErrorBoundary sectionName="Vacation Rentals CTA">
        <LazySection threshold={0.15} rootMargin="150px">
          <Suspense fallback={<SectionSkeleton height="h-80" />}>
            <VacationRentalsCTA />
          </Suspense>
        </LazySection>
      </SectionErrorBoundary>

      {/* Featured Businesses - Heavy component, load last */}
      <SectionErrorBoundary sectionName="Featured Businesses">
        <LazySection threshold={0.2} rootMargin="100px">
          <Suspense fallback={<BusinessSkeleton />}>
            <FeaturedBusinesses limit={3} />
          </Suspense>
        </LazySection>
      </SectionErrorBoundary>

      {/* CTA Section - Load when close to viewport */}
      <SectionErrorBoundary sectionName="Call to Action">
        <LazySection threshold={0.3} rootMargin="100px">
          <Suspense fallback={<SectionSkeleton height="h-32" />}>
            <section id="cta-section">
              <CTASection />
            </section>
          </Suspense>
        </LazySection>
      </SectionErrorBoundary>
    </>
  );
};

export default HomePageSections;
