
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
      <HeroSection 
        title="About Mansa Musa Marketplace"
        description="Building economic power through community circulation"
        imageUrl="/lovable-uploads/1dd9f7bc-bb83-4c92-b250-e11f63790f8c.png"
      />

      {/* Mission Section */}
      <MissionSection 
        heading="Our Mission"
        description="Mansa Musa Marketplace aims to stimulate economic growth within underserved communities by encouraging the circulation of dollars within local businesses. By creating a network of businesses and consumers committed to supporting each other, we build collective wealth and prosperity."
      />

      {/* Vision Section */}
      <VisionSection 
        heading="Our Vision"
        description="We envision thriving communities where local dollars circulate multiple times before leaving, creating jobs, opportunities, and sustainable growth. Through our marketplace, we're building an ecosystem where everyone benefits from keeping economic resources within the community."
      />

      {/* Impact Metrics */}
      <ImpactMetricsSection 
        metrics={[
          { value: "250+", label: "Local Businesses", icon: "Store" },
          { value: "10K+", label: "Community Members", icon: "Users" },
          { value: "$1.2M+", label: "Dollars Circulated", icon: "CircleDollarSign" },
          { value: "5x", label: "Circulation Multiplier", icon: "Repeat" },
        ]}
      />

      {/* Team Section */}
      <TeamSection 
        heading="Meet Our Team"
        description="Dedicated professionals working to strengthen our communities through economic empowerment."
        team={[
          {
            name: "Aisha Johnson",
            title: "Founder & CEO",
            bio: "With over 15 years of experience in community economic development, Aisha founded Mansa Musa Marketplace to address wealth gaps in underserved communities.",
            imageUrl: "/placeholder.svg"
          },
          {
            name: "Marcus Williams",
            title: "Chief Technology Officer",
            bio: "Marcus brings extensive expertise in building scalable tech platforms that serve community needs while ensuring security and accessibility.",
            imageUrl: "/placeholder.svg"
          },
          {
            name: "Zara Thompson",
            title: "Community Engagement Director",
            bio: "Zara works directly with businesses and community members to build strong relationships and ensure the platform meets real community needs.",
            imageUrl: "/placeholder.svg"
          }
        ]}
      />

      {/* Quote Section */}
      <QuoteSection 
        quote="When we circulate dollars within our community, we're not just making purchases - we're making investments in our collective future."
        author="Aisha Johnson, Founder"
      />

      {/* Timeline */}
      <TimelineSection 
        heading="Our Journey"
        events={[
          { year: 2020, title: "The Idea", description: "Concept development and community research" },
          { year: 2021, title: "First Steps", description: "Platform development and initial business onboarding" },
          { year: 2022, title: "Community Launch", description: "Official launch with 50 founding businesses" },
          { year: 2023, title: "Expansion", description: "Reached 200+ businesses and 5,000 community members" },
          { year: 2024, title: "Growth & Impact", description: "Documented economic impact with increased circulation" }
        ]}
      />

      {/* FAQ Section */}
      <FAQSection 
        heading="Frequently Asked Questions"
        questions={[
          {
            question: "What is Mansa Musa Marketplace?",
            answer: "Mansa Musa Marketplace is a platform designed to connect community members with local businesses, encouraging economic circulation within underserved communities."
          },
          {
            question: "How does the circulation model work?",
            answer: "Our circulation model tracks and encourages dollars spent at local businesses to remain within the community ecosystem, creating a multiplier effect that benefits all participants."
          },
          {
            question: "How can I join as a business?",
            answer: "Businesses can sign up through our business registration page. We offer support throughout the onboarding process to ensure you maximize the benefits of being part of our network."
          },
          {
            question: "What are loyalty points and how do they work?",
            answer: "Loyalty points are earned when community members shop at participating businesses. These points can be redeemed for rewards, discounts, and special offers throughout the marketplace."
          }
        ]}
      />

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
};

export default AboutUsPage;
