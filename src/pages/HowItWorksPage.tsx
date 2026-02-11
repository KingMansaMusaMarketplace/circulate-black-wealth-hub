
import React, { useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HowItWorks/HeroSection';
import HowItWorksSteps from '@/components/HowItWorks/HowItWorksSteps';
import CTASection from '@/components/HowItWorks/CTASection';
import PageNavigation from '@/components/HowItWorks/PageNavigation';
import TestimonialsSection from '@/components/HowItWorks/TestimonialsSection';
import MansaMusaHistory from '@/components/HowItWorks/MansaMusaHistory';
import FAQSection from '@/components/HowItWorks/FAQSection';
import VisualDivider from '@/components/HowItWorks/VisualDivider';
import LazySection from '@/components/common/LazySection';
import { 
  LazyInteractiveDemo,
  LazyCirculationVisualization,
  LazySponsorshipVideoSection
} from '@/components/lazy';

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
    { id: 'interactive-demo', label: 'Demo' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'videos', label: 'Videos' },
    { id: 'circulation-visualization', label: 'Money Flow' },
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
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-mansablue-dark via-mansablue to-mansablue-dark"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Premium ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-mansagold/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="relative z-10">
        <HeroSection />
        <PageNavigation sections={navSections} />
      
      {/* Interactive Demo Section */}
        <LazySection threshold={0.3} rootMargin="150px">
          <section id="interactive-demo">
            <Suspense fallback={
              <div className="py-16 backdrop-blur-xl bg-white/5">
                <div className="max-w-7xl mx-auto px-4 text-center">
                  <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-white/10 rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                      <div className="space-y-4">
                        <div className="h-6 bg-white/10 rounded"></div>
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                        <div className="h-32 bg-white/10 rounded"></div>
                      </div>
                      <div className="h-96 bg-white/10 rounded-3xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            }>
            <LazyInteractiveDemo />
          </Suspense>
        </section>
      </LazySection>

      <HowItWorksSteps />
      
      <section id="videos">
        <Suspense fallback={<div className="py-12" />}>
          <LazySponsorshipVideoSection />
        </Suspense>
      </section>
      
        <VisualDivider />
        <Suspense fallback={<div className="py-12" />}>
          <LazyCirculationVisualization />
        </Suspense>
        <TestimonialsSection />
        <MansaMusaHistory />
        <FAQSection />
        <CTASection />
      </div>
    </motion.div>
  );
};

export default HowItWorksPage;
