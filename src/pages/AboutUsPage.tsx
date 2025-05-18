
import React from 'react';
import { Helmet } from 'react-helmet';
import {
  HeroSection,
  MissionSection,
  VisionSection,
  TeamSection,
  ImpactMetricsSection,
  FAQSection,
  ContactSection,
  TimelineSection,
  QuoteSection,
} from '../components/AboutPage';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About Us | Mansa Musa Marketplace</title>
        <meta name="description" content="Learn about our mission, vision, and the team behind Mansa Musa Marketplace" />
      </Helmet>

      {/* Hero Section */}
      <HeroSection />

      {/* Mission Section */}
      <MissionSection />

      {/* Vision Section */}
      <VisionSection />

      {/* Impact Metrics */}
      <ImpactMetricsSection />

      {/* Team Section */}
      <TeamSection />

      {/* Quote Section */}
      <QuoteSection />

      {/* Timeline */}
      <TimelineSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
};

export default AboutUsPage;
