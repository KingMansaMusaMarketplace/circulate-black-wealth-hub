
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import VideoPlayer from '../components/VideoPlayer';
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
  AuthorSection,
} from '../components/AboutPage';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About Us | Mansa Musa Marketplace</title>
        <meta name="description" content="Learn about our mission, vision, and the team behind Mansa Musa Marketplace" />
      </Helmet>
      
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Author Section - Thomas D. Bowling */}
      <AuthorSection />

      {/* Mission Section */}
      <MissionSection />

      {/* Mansa Musa Video */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 inline-block relative">
              Who was Mansa Musa?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-500"></span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Learn about the legendary African ruler who inspired our marketplace and represents the pinnacle of economic power coupled with community reinvestment.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoPlayer 
              src="https://www.youtube.com/watch?v=6DudveUFGRo" 
              title="Who was Mansa Musa?" 
              isYouTube={true}
              className="shadow-xl"
            />
          </div>
        </div>
      </section>

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

      <Footer />
    </div>
  );
};

export default AboutUsPage;
