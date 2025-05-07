
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

const PageNavigation = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [scrolled, setScrolled] = useState<boolean>(false);
  
  const sections: Section[] = [
    { id: 'hero', label: 'Overview' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'history', label: 'Our Story' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Adjust for fixed header if needed
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if the page has scrolled to update the navigation bar style
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      ).filter(Boolean) as HTMLElement[];
      
      let currentActive = sections[0].id;
      
      for (const section of sectionElements) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200) {
          currentActive = section.id;
        } else {
          break;
        }
      }
      
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  return (
    <nav className={cn(
      "sticky top-[72px] z-40 transition-all duration-300",
      scrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
    )}>
      <div className="container-custom px-4">
        <div className="overflow-x-auto scrollbar-none">
          <motion.div 
            className="flex space-x-2 py-2 min-w-max"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-300",
                  activeSection === section.id
                    ? "bg-mansablue text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {section.label}
                {activeSection === section.id && (
                  <motion.div 
                    className="h-1 bg-mansagold rounded-full mt-1"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default PageNavigation;
