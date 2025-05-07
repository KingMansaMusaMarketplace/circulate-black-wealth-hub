
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Testimonial } from './testimonialData';

interface AnimatedTestimonialProps {
  testimonials: Testimonial[];
  activeIndex: number;
}

const AnimatedTestimonial: React.FC<AnimatedTestimonialProps> = ({ 
  testimonials, 
  activeIndex 
}) => {
  return (
    <div className="relative h-64 md:h-48">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          className="absolute w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ 
            opacity: activeIndex === index ? 1 : 0,
            x: activeIndex === index ? 0 : 20,
            zIndex: activeIndex === index ? 10 : 0 
          }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl text-gray-700 mb-6">{testimonial.quote}</p>
          <div className="flex items-center">
            <Avatar className="h-12 w-12 border-2 border-mansagold/20">
              <AvatarImage src={testimonial.image} alt={testimonial.author} />
              <AvatarFallback className="bg-mansablue/10 text-mansablue">
                {testimonial.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <p className="font-semibold text-gray-900">{testimonial.author}</p>
              <div className="flex items-center">
                <p className="text-sm text-gray-500 mr-2">{testimonial.title}</p>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={12} className="text-mansagold fill-mansagold" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedTestimonial;
