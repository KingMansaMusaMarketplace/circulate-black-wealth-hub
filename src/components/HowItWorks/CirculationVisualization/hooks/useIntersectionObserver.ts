
import { useState, useEffect } from 'react';

interface UseIntersectionObserverProps {
  elementId: string;
  threshold?: number;
  rootMargin?: string;
}

export const useIntersectionObserver = ({ 
  elementId, 
  threshold = 0.3,
  rootMargin = '0px'
}: UseIntersectionObserverProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      }, 
      { threshold, rootMargin }
    );
    
    const element = document.getElementById(elementId);
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [elementId, threshold, rootMargin]);

  return isVisible;
};

export default useIntersectionObserver;
