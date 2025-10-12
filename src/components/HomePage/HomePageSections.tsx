
import React, { Suspense } from 'react';
import FeaturedBusinesses from '@/components/FeaturedBusinesses';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import { BenefitsSection } from '@/components/HowItWorks/Benefits';
import { SocialProofWidget } from '@/components/social-proof';
import { SponsorLogoGrid } from '@/components/sponsors';
import LazySection from '@/components/common/LazySection';

const HomePageSections: React.FC = () => {
  return (
    <>
      {/* Social Proof Section */}
      <section id="social-proof">
        <SocialProofWidget />
      </section>

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

      {/* Corporate Sponsors */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-2">
            Our Corporate Partners
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Supporting our mission to build community wealth
          </p>
          <SponsorLogoGrid
            placement="homepage"
            maxLogos={8}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section">
        <CTASection />
      </section>
    </>
  );
};

export default HomePageSections;
