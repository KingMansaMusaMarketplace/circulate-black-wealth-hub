
import React, { useState, useEffect } from 'react';
import { ArrowUp } from "lucide-react";
import { Button } from '@/components/ui/button';

const ScrollToTopButton: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Listen for scroll events to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (!showScrollTop) return null;
  
  return (
    <Button 
      className="fixed bottom-6 right-6 rounded-full shadow-lg bg-mansablue hover:bg-mansablue/90 h-12 w-12"
      onClick={scrollToTop}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

export default ScrollToTopButton;
