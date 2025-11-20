
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
          className="backdrop-blur-xl bg-white/10 hover:bg-white/20 rounded-full p-2 shadow-lg transition-all border border-white/20"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
      </div>
      
      <div className="absolute top-1/2 -right-5 transform -translate-y-1/2 hidden md:block">
        <button 
          onClick={handleNext}
          className="backdrop-blur-xl bg-white/10 hover:bg-white/20 rounded-full p-2 shadow-lg transition-all border border-white/20"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      </div>
    </>
  );
};

export default TestimonialNavigation;
