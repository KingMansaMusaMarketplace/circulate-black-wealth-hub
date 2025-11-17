
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

interface PageNavigationProps {
  sections: Section[];
  offset?: number;
}

const PageNavigation = ({ sections, offset = -100 }: PageNavigationProps) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [scrolled, setScrolled] = useState<boolean>(false);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
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
      
      // Find the current section by checking their positions
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      ).filter(Boolean) as HTMLElement[];
      
      // Set a threshold for when a section is considered active
      const offset = window.innerHeight * 0.3;
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        const rect = section.getBoundingClientRect();
        
        // If the section is visible in the viewport (allowing for some offset)
        if (rect.top < offset) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initialize active section on mount
    setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  return (
    <nav className={cn(
      "sticky top-[72px] z-40 transition-all duration-300 border-b",
      scrolled ? "bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-mansablue/20 border-white/10" : "bg-slate-900/80 backdrop-blur-md border-white/5"
    )}>
      <div className="container-custom px-4">
        <div className="overflow-x-auto scrollbar-none py-1">
          <motion.div 
            className="flex space-x-1 md:space-x-2 py-2 min-w-max"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200 relative",
                  activeSection === section.id
                    ? "text-white bg-mansablue/20"
                    : "text-blue-200/70 hover:text-white hover:bg-slate-800/50"
                )}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {section.label}
                {activeSection === section.id && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-mansagold to-amber-400"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default PageNavigation;
