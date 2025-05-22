
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HowItWorks/HeroSection';
import HowItWorksSteps from '@/components/HowItWorks/HowItWorksSteps';
import { BenefitsSection } from '@/components/HowItWorks/Benefits';
import CTASection from '@/components/HowItWorks/CTASection';
import PageNavigation from '@/components/HowItWorks/PageNavigation';
import CirculationVisualization from '@/components/HowItWorks/CirculationVisualization/CirculationVisualization';
import TestimonialsSection from '@/components/HowItWorks/TestimonialsSection';
import MansaMusaHistory from '@/components/HowItWorks/MansaMusaHistory';
import FAQSection from '@/components/HowItWorks/FAQSection';
import VisualDivider from '@/components/HowItWorks/VisualDivider';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/navbar';
import SponsorshipVideoSection from '@/components/HowItWorks/SponsorshipVideoSection';

const HowItWorksPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Update page title and add meta description
    document.title = 'How It Works | Mansa Musa Marketplace';
    
    // Add meta description if it doesn't exist
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 
      'Learn how Mansa Musa Marketplace works to help you discover, support, and save at Black-owned businesses in your community.'
    );
  }, []);

  const navSections = [
    { id: 'hero', label: 'Overview' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'videos', label: 'Videos' },
    { id: 'circulation-visualization', label: 'Money Flow' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'history', label: 'Our Story' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta-section', label: 'Join Us' }
  ];

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      } 
    },
    exit: { opacity: 0 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Navbar />
      <HeroSection />
      <PageNavigation sections={navSections} />
      <HowItWorksSteps />
      <section id="videos">
        <SponsorshipVideoSection />
      </section>
      <VisualDivider />
      <CirculationVisualization />
      <BenefitsSection />
      <TestimonialsSection />
      <MansaMusaHistory />
      <FAQSection />
      <CTASection />
      <Footer />
    </motion.div>
  );
};

export default HowItWorksPage;
