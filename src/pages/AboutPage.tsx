
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestimonialsSection from '@/components/TestimonialsSection';
import { 
  HeroSection,
  MissionSection, 
  VisionSection,
  AuthorSection,
  QuoteSection,
  CTASection,
  TeamSection,
  TimelineSection,
  PartnersSection,
  ImpactMetricsSection,
  FAQSection,
  MediaGallerySection,
  ContactSection
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
        <TeamSection />
        <TimelineSection />
        <PartnersSection />
        <TestimonialsSection />
        <ImpactMetricsSection />
        <MediaGallerySection />
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
