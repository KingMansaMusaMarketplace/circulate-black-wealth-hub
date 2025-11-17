
import React, { useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HowItWorks/HeroSection';
import HowItWorksSteps from '@/components/HowItWorks/HowItWorksSteps';
import CTASection from '@/components/HowItWorks/CTASection';
import PageNavigation from '@/components/HowItWorks/PageNavigation';
import CirculationVisualization from '@/components/HowItWorks/CirculationVisualization/CirculationVisualization';
import TestimonialsSection from '@/components/HowItWorks/TestimonialsSection';
import MansaMusaHistory from '@/components/HowItWorks/MansaMusaHistory';
import FAQSection from '@/components/HowItWorks/FAQSection';
import VisualDivider from '@/components/HowItWorks/VisualDivider';
import SponsorshipVideoSection from '@/components/HowItWorks/SponsorshipVideoSection';
import LazySection from '@/components/common/LazySection';
import { 
  LazyInteractiveDemo
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
      className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-700/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      <div className="relative z-10">
        <HeroSection />
        <PageNavigation sections={navSections} />
      
      {/* Interactive Demo Section */}
        <LazySection threshold={0.3} rootMargin="150px">
          <section id="interactive-demo">
            <Suspense fallback={
              <div className="py-16 bg-slate-900/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 text-center">
                  <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-700/50 rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-slate-700/50 rounded w-3/4 mx-auto"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                      <div className="space-y-4">
                        <div className="h-6 bg-slate-700/50 rounded"></div>
                        <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                        <div className="h-32 bg-slate-700/50 rounded"></div>
                      </div>
                      <div className="h-96 bg-slate-700/50 rounded-3xl"></div>
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
        <SponsorshipVideoSection />
      </section>
      
        <VisualDivider />
        <CirculationVisualization />
        <TestimonialsSection />
        <MansaMusaHistory />
        <FAQSection />
        <CTASection />
      </div>
    </motion.div>
  );
};

export default HowItWorksPage;
