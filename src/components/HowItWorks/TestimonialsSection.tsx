
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { 
  AnimatedTestimonial, 
  TestimonialNavigation, 
  TestimonialDots, 
  testimonials 
} from './Testimonials';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
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
      { threshold: 0.1 }
    );
    
    const section = document.getElementById('testimonials');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Auto rotate testimonials - only if there are testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden backdrop-blur-xl bg-white/5">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-yellow-500/10 blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-lg text-white mb-4">From Our Community</h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            Discover why members and businesses are joining the movement.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          {testimonials.length === 0 ? (
            <motion.div 
              className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl p-8 relative border border-white/20 text-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Quote size={40} className="mx-auto text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Testimonials Coming Soon</h3>
              <p className="text-white/80">
                Be among the first to share your experience with our community!
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Main testimonial */}
              <motion.div 
                className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl p-8 relative border border-white/20"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {/* Quote icon */}
                <div className="absolute top-6 left-8 text-yellow-400 opacity-30">
                  <Quote size={40} />
                </div>
                
                {/* Navigation buttons */}
                <TestimonialNavigation 
                  handlePrevious={handlePrevious} 
                  handleNext={handleNext} 
                />
                
                {/* Testimonial content */}
                <div className="pt-8">
                  <div className="testimonial-content">
                    <AnimatedTestimonial 
                      testimonials={testimonials} 
                      activeIndex={activeIndex} 
                    />
                  </div>
                  
                  {/* Dots indicator */}
                  <TestimonialDots 
                    count={testimonials.length} 
                    activeIndex={activeIndex} 
                    onDotClick={setActiveIndex}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-white">
            Help us reach <span className="font-bold">1 million members</span> building wealth together.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
