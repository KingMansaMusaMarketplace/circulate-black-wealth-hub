
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
          <p className="text-xl text-white/90 mb-6 leading-relaxed">{testimonial.quote}</p>
          <div className="flex items-center">
            <Avatar className="h-12 w-12 border-2 border-yellow-400/30">
              <AvatarImage src={testimonial.image} alt={testimonial.author} />
              <AvatarFallback className="bg-blue-500/20 text-blue-300">
                {testimonial.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <p className="font-semibold text-white">{testimonial.author}</p>
              <div className="flex items-center">
                <p className="text-sm text-white/70 mr-2">{testimonial.title}</p>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
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
