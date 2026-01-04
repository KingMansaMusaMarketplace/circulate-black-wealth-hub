
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import TestimonialsSection from '@/components/TestimonialsSection';
import { 
  HeroSection,
  MissionSection, 
  SuccessStoriesSection,
  VisionSection,
  AuthorSection,
  QuoteSection,
  CTASection,
  TeamSection,
  InteractiveVisionTimeline,
  PartnersSection,
  ImpactMetricsSection,
  FAQSection,
  MediaGallerySection,
  ContactSection,
  PersonalizedRecommendations,
  AccessibilityFeatures,
  GamificationFeatures
} from '@/components/AboutPage';
import MansaMusaVideoSection from '@/components/AboutPage/MansaMusaVideoSection';
import { BreadcrumbStructuredData, generateBreadcrumbs } from '@/components/SEO/BreadcrumbStructuredData';
import { FAQStructuredData, marketplaceFAQs } from '@/components/SEO/FAQStructuredData';
import { updateMetaTags, pageSEO } from '@/utils/seoUtils';

const AboutPage = () => {
  useEffect(() => {
    updateMetaTags({
      title: pageSEO.about.title,
      description: pageSEO.about.description,
      path: '/about',
      keywords: pageSEO.about.keywords,
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>{pageSEO.about.title}</title>
        <meta name="description" content={pageSEO.about.description} />
        <meta name="keywords" content={pageSEO.about.keywords.join(', ')} />
      </Helmet>
      
      <BreadcrumbStructuredData items={generateBreadcrumbs.about()} />
      <FAQStructuredData faqs={marketplaceFAQs} />
      
      <div className="relative overflow-hidden bg-gradient-to-b from-mansablue-dark via-mansablue to-mansablue-dark">
        {/* Premium ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-mansagold/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[150px]" />
        </div>
        
        {/* Grid pattern overlay */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
        
        <main className="relative z-10">
          <HeroSection />
          <AuthorSection />
          <MissionSection />
          <MansaMusaVideoSection />
          <VisionSection />
          <InteractiveVisionTimeline />
          <SuccessStoriesSection />
          <TeamSection />
          <ImpactMetricsSection />
          <PersonalizedRecommendations />
          <GamificationFeatures />
          <MediaGallerySection />
          <TestimonialsSection />
          <AccessibilityFeatures />
          <PartnersSection />
          <ContactSection />
          <FAQSection />
          <QuoteSection />
          <CTASection />
        </main>
      </div>
    </>
  );
};

export default AboutPage;
