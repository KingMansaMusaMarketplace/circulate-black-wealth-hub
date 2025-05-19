
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  CommunityForum,
  PersonalizedRecommendations,
  AccessibilityFeatures,
  GamificationFeatures
} from '@/components/AboutPage';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <AuthorSection />
        <MissionSection />
        <VisionSection />
        <InteractiveVisionTimeline />
        <SuccessStoriesSection />
        <TeamSection />
        <ImpactMetricsSection />
        <PersonalizedRecommendations />
        <GamificationFeatures />
        <CommunityForum />
        <MediaGallerySection />
        <TestimonialsSection />
        <AccessibilityFeatures />
        <PartnersSection />
        <ContactSection />
        <FAQSection />
        <QuoteSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
