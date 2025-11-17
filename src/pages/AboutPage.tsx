
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
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 -z-10"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-40 right-40 w-[32rem] h-[32rem] bg-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
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
