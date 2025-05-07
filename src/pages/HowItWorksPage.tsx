
import React, { useState, useEffect } from 'react';
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
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HowItWorksPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sections = [
    { id: 'hero', label: 'Overview' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'history', label: 'Our Story' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <PageNavigation sections={sections} />
      <main className="flex-grow">
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
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-mansablue hover:bg-mansablue-dark text-white rounded-full p-3 shadow-lg z-50"
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
