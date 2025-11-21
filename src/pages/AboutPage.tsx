
import React from 'react';
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

const AboutPage = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-700/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>
      </div>
      
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
  );
};

export default AboutPage;
