
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
    <main>
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
  );
};

export default AboutPage;
