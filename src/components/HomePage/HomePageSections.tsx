import React, { Suspense, lazy } from 'react';

import { SectionErrorBoundary } from '@/components/error-boundary/SectionErrorBoundary';
import LazySection from './LazySection';
import BlackOwnedDiscoverySection from './BlackOwnedDiscoverySection';

// Lazy load all non-critical sections
const ConsumerBenefits = lazy(() => import('./ConsumerBenefits'));

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


const HomePageSections: React.FC = () => {
  return (
    <>
      {/* 1. Mission Preview — removed per user request */}

      {/* 2. Consumer Benefits — removed per user request */}

      {/* 3. Trust Stat Strip — credibility beat for cold traffic before social proof */}
      {/* Removed per user request */}


      {/* 4.5 Black-Owned Discovery — hidden from homepage (kept in code for SEO landing pages) */}
      {/* <SectionErrorBoundary sectionName="Black-Owned Discovery">
        <BlackOwnedDiscoverySection />
      </SectionErrorBoundary> */}

      {/* 5. CTA — removed per user request */}

      {/* Meet Kayla — justifies the price with the feature deep-dive */}
      <SectionErrorBoundary sectionName="Meet Kayla">
        <LazySection fallback={<SectionSkeleton height="h-48" />} minHeight="min-h-[200px]">
          <MeetKaylaSection />
        </LazySection>
      </SectionErrorBoundary>

      {/* Pricing — answers the cost objection first */}
      <SectionErrorBoundary sectionName="Pricing">
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <PricingSection />
        </Suspense>
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
