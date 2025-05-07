
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      quote: "I discovered 10 new Black-owned businesses in my city within a week! Mansa Musa Marketplace makes it so easy to support and save.",
      author: "Jasmine Williams",
      title: "Early Beta Tester",
      image: "/placeholder.svg"
    },
    {
      quote: "As a business owner, I gained 25 new customers the first month. Best $50/month I've ever spent.",
      author: "Marcus Johnson",
      title: "Business Beta Partner",
      image: "/placeholder.svg"
    },
    {
      quote: "The loyalty points system keeps me coming back. I'm supporting my community AND saving money.",
      author: "Tasha Robinson",
      title: "Marketplace Member",
      image: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-20 bg-mansablue relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-mansagold/10 blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-lg text-white mb-4">From Our Community</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Discover why members and businesses are joining the movement.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="grid grid-cols-1"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Main testimonial */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* Quote icon */}
              <div className="absolute top-6 left-8 text-mansagold opacity-30">
                <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.33333 16H4L8 8H12L9.33333 16ZM21.3333 16H16L20 8H24L21.3333 16Z" fill="currentColor"/>
                  <path d="M9.33333 16V24H16V16H9.33333ZM21.3333 16V24H28V16H21.3333Z" fill="currentColor"/>
                </svg>
              </div>
              
              {/* Testimonial content */}
              <div className="pt-8">
                <div className="testimonial-content">
                  <AnimatedTestimonial 
                    testimonials={testimonials} 
                    activeIndex={activeIndex} 
                  />
                </div>
                
                {/* Dots indicator */}
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300",
                        activeIndex === index 
                          ? "bg-mansablue" 
                          : "bg-gray-300 hover:bg-gray-400"
                      )}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-white">
            Join our community of <span className="font-bold">10,000+ subscribers</span> and discover the benefits yourself.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Component to handle the animated testimonial transitions
const AnimatedTestimonial = ({ testimonials, activeIndex }) => {
  return (
    <div className="relative h-48">
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
            <div className="w-12 h-12 rounded-full bg-mansablue/10 text-mansablue flex items-center justify-center text-lg font-bold">
              {testimonial.author.charAt(0)}
            </div>
            <div className="ml-4">
              <p className="font-semibold text-gray-900">{testimonial.author}</p>
              <p className="text-sm text-gray-500">{testimonial.title}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TestimonialsSection;
