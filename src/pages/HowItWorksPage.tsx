
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HowItWorks/HeroSection';
import HowItWorksSteps from '@/components/HowItWorks/HowItWorksSteps';
import BenefitsSection from '@/components/HowItWorks/BenefitsSection';
import MansaMusaHistory from '@/components/HowItWorks/MansaMusaHistory';
import FAQSection from '@/components/HowItWorks/FAQSection';
import TestimonialsSection from '@/components/HowItWorks/TestimonialsSection';
import CTASection from '@/components/HowItWorks/CTASection';
import PageNavigation from '@/components/HowItWorks/PageNavigation';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageNavigation />
      <main>
        <section id="hero">
          <HeroSection />
        </section>
        <section id="how-it-works">
          <HowItWorksSteps />
        </section>
        <section id="benefits">
          <BenefitsSection />
        </section>
        <section id="history">
          <MansaMusaHistory />
        </section>
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        <section id="faq">
          <FAQSection />
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
