import React, { Suspense, lazy } from 'react';

import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import LazySection from './LazySection';
import BlackOwnedDiscoverySection from './BlackOwnedDiscoverySection';

// Lazy load all non-critical sections
const ConsumerBenefits = lazy(() => import('./ConsumerBenefits'));
const FeaturedBusinesses = lazy(() => import('@/components/FeaturedBusinesses'));
const CTASection = lazy(() => import('@/components/CTASection'));

const MissionPreview = lazy(() => import('./MissionPreview'));
const PricingSection = lazy(() => import('./PricingSection'));

const VacationRentalsCTA = lazy(() => import('./VacationRentalsCTA'));
const NoirRideCTA = lazy(() => import('./NoirRideCTA'));

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
      {/* 1. Mission Preview — immediately after Hero for instant clarity */}
      <SectionErrorBoundary sectionName="Mission Preview">
        <Suspense fallback={<SectionSkeleton height="h-24" />}>
          <MissionPreview />
        </Suspense>
      </SectionErrorBoundary>

      {/* 2. Consumer Benefits */}
      <SectionErrorBoundary sectionName="Consumer Benefits">
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <ConsumerBenefits />
        </Suspense>
      </SectionErrorBoundary>

      {/* 3. Trust Stat Strip — credibility beat for cold traffic before social proof */}
      {/* Removed per user request */}

      {/* 4. Featured Businesses — strongest social proof, leads into CTA */}
      <SectionErrorBoundary sectionName="Featured Businesses">
        <LazySection fallback={<BusinessSkeleton />} minHeight="min-h-[200px]">
          <FeaturedBusinesses limit={3} />
        </LazySection>
      </SectionErrorBoundary>

      {/* 4.5 Black-Owned Discovery — hidden from homepage (kept in code for SEO landing pages) */}
      {/* <SectionErrorBoundary sectionName="Black-Owned Discovery">
        <BlackOwnedDiscoverySection />
      </SectionErrorBoundary> */}

      {/* 5. CTA — hit while intent is hot */}
      <SectionErrorBoundary sectionName="Call to Action">
        <LazySection fallback={<SectionSkeleton height="h-32" />} minHeight="min-h-[150px]">
          <section id="cta-section">
            <CTASection />
          </section>
        </LazySection>
      </SectionErrorBoundary>

      {/* Pricing — answers the cost objection first */}
      <SectionErrorBoundary sectionName="Pricing">
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <PricingSection />
        </Suspense>
      </SectionErrorBoundary>

      {/* Meet Kayla — justifies the price with the feature deep-dive */}
      <SectionErrorBoundary sectionName="Meet Kayla">
        <LazySection fallback={<SectionSkeleton height="h-48" />} minHeight="min-h-[200px]">
          <MeetKaylaSection />
        </LazySection>
      </SectionErrorBoundary>

      {/* Mansa Stays — full-width section */}
      <SectionErrorBoundary sectionName="Mansa Stays">
        <LazySection fallback={<SectionSkeleton height="h-48" />} minHeight="min-h-[200px]">
          <VacationRentalsCTA />
        </LazySection>
      </SectionErrorBoundary>

      {/* Noire Rideshare — full-width section */}
      <SectionErrorBoundary sectionName="Noire Rideshare">
        <LazySection fallback={<SectionSkeleton height="h-48" />} minHeight="min-h-[200px]">
          <NoirRideCTA />
        </LazySection>
      </SectionErrorBoundary>
    </>
  );
};

export default HomePageSections;
