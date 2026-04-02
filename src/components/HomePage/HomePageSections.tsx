import React, { Suspense, lazy } from 'react';

import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import LazySection from './LazySection';

// Lazy load all non-critical sections
const FeaturedBusinesses = lazy(() => import('@/components/FeaturedBusinesses'));
const CTASection = lazy(() => import('@/components/CTASection'));

const MissionPreview = lazy(() => import('./MissionPreview'));
const PricingSection = lazy(() => import('./PricingSection'));
const ThreePillars = lazy(() => import('./ThreePillars'));
const VacationRentalsCTA = lazy(() => import('./VacationRentalsCTA'));
const NoirRideCTA = lazy(() => import('./NoirRideCTA'));
const CirculationGap = lazy(() => import('./CirculationGap'));
const MeetKaylaSection = lazy(() => import('./MeetKaylaSection'));

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
      {/* Mission Preview — near fold, load eagerly */}
      <SectionErrorBoundary sectionName="Mission Preview">
        <Suspense fallback={<SectionSkeleton height="h-24" />}>
          <MissionPreview />
        </Suspense>
      </SectionErrorBoundary>

      {/* Pricing Tiers — near fold, load eagerly */}
      <SectionErrorBoundary sectionName="Pricing">
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <PricingSection />
        </Suspense>
      </SectionErrorBoundary>

      {/* Below-fold sections: deferred until near viewport */}

      <SectionErrorBoundary sectionName="Featured Businesses">
        <LazySection fallback={<BusinessSkeleton />} minHeight="min-h-[200px]">
          <FeaturedBusinesses limit={3} />
        </LazySection>
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Three Pillars">
        <LazySection fallback={<SectionSkeleton />} minHeight="min-h-[150px]">
          <ThreePillars />
        </LazySection>
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Meet Kayla">
        <LazySection fallback={<SectionSkeleton height="h-48" />} minHeight="min-h-[200px]">
          <MeetKaylaSection />
        </LazySection>
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Call to Action">
        <LazySection fallback={<SectionSkeleton height="h-32" />} minHeight="min-h-[150px]">
          <section id="cta-section">
            <CTASection />
          </section>
        </LazySection>
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Vacation Rentals CTA">
        <LazySection fallback={<SectionSkeleton height="h-48" />} minHeight="min-h-[200px]">
          <VacationRentalsCTA />
        </LazySection>
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Noir Ride CTA">
        <LazySection fallback={<SectionSkeleton height="h-48" />} minHeight="min-h-[200px]">
          <NoirRideCTA />
        </LazySection>
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="Circulation Gap">
        <LazySection fallback={<SectionSkeleton height="h-48" />} minHeight="min-h-[200px]">
          <CirculationGap />
        </LazySection>
      </SectionErrorBoundary>
    </>
  );
};

export default HomePageSections;
