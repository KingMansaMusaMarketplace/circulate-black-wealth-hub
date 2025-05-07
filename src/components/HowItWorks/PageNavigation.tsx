
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  label: string;
}

const PageNavigation = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  
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
    <nav className="sticky top-[72px] z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="container-custom px-4">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex space-x-2 py-2 min-w-max">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                  activeSection === section.id
                    ? "bg-mansablue text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PageNavigation;
