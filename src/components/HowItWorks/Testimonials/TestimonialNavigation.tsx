
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialNavigationProps {
  handlePrevious: () => void;
  handleNext: () => void;
}

const TestimonialNavigation: React.FC<TestimonialNavigationProps> = ({ 
  handlePrevious, 
  handleNext 
}) => {
  return (
    <>
      <div className="absolute top-1/2 -left-5 transform -translate-y-1/2 hidden md:block">
        <button 
          onClick={handlePrevious}
          className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5 text-mansablue" />
        </button>
      </div>
      
      <div className="absolute top-1/2 -right-5 transform -translate-y-1/2 hidden md:block">
        <button 
          onClick={handleNext}
          className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5 text-mansablue" />
        </button>
      </div>
    </>
  );
};

export default TestimonialNavigation;
