
import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import TeamSection from '@/components/AboutPage/TeamSection';
import ContactSection from '@/components/AboutPage/ContactSection';
import PageNavigation from '@/components/HowItWorks/PageNavigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const TeamContactPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sections = [
    { id: 'team', label: 'Our Team' },
    { id: 'contact', label: 'Contact Us' }
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageNavigation sections={sections} />
      <main>
        <section className="py-16 bg-gradient-to-b from-mansablue/10 to-white">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-mansablue mb-4">Our Team</h1>
            <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated team behind Mansa Musa Marketplace, working to empower Black communities and businesses.
            </p>
            <div className="flex justify-center mt-8">
              <Button 
                className="bg-mansablue hover:bg-mansablue-dark text-white mr-4"
                onClick={() => scrollToSection('team')}
              >
                Meet the Team
              </Button>
              <Button 
                variant="outline"
                className="border-mansablue text-mansablue hover:bg-mansablue hover:text-white"
                onClick={() => scrollToSection('contact')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
        
        <section id="team">
          <TeamSection />
        </section>
        
        <section id="contact">
          <ContactSection />
        </section>
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

export default TeamContactPage;
