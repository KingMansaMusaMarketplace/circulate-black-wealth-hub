
import React from 'react';
import { cn } from '@/lib/utils';

interface TestimonialDotsProps {
  count: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}

const TestimonialDots: React.FC<TestimonialDotsProps> = ({ 
  count, 
  activeIndex, 
  onDotClick 
}) => {
  return (
    <div className="flex justify-center mt-8 space-x-2">
      {[...Array(count)].map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={cn(
            "w-3 h-3 rounded-full transition-all duration-300",
            activeIndex === index 
              ? "bg-yellow-400" 
              : "bg-white/30 hover:bg-white/50"
          )}
          aria-label={`View testimonial ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default TestimonialDots;
