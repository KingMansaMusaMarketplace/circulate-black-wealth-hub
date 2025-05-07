
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  // Check if section is visible
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
      { threshold: 0.2 }
    );
    
    const section = document.querySelector('#home-testimonials');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const testimonials = [
    {
      quote: "I discovered 10 new Black-owned businesses in my city within a week! Mansa Musa Marketplace makes it so easy to support and save.",
      author: "Jasmine Williams",
      title: "Early Beta Tester",
      image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsYWNrJTIwd29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      rating: 5
    },
    {
      quote: "As a business owner, I gained 25 new customers the first month. Best $50/month I've ever spent.",
      author: "Marcus Johnson",
      title: "Business Beta Partner",
      image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsYWNrJTIwbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      rating: 5
    },
    {
      quote: "The loyalty points system keeps me coming back. I'm supporting my community AND saving money.",
      author: "Tasha Robinson",
      title: "Marketplace Member",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmxhY2slMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      rating: 5
    }
  ];

  const handlePrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    toast({
      title: "Previous testimonial",
      description: `Now showing ${testimonials[(activeIndex - 1 + testimonials.length) % testimonials.length].author}'s testimonial`,
      duration: 1500,
    });
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    toast({
      title: "Next testimonial", 
      description: `Now showing ${testimonials[(activeIndex + 1) % testimonials.length].author}'s testimonial`,
      duration: 1500,
    });
  };

  const selectTestimonial = (index) => {
    setActiveIndex(index);
    toast({
      title: "Testimonial selected",
      description: `Now showing ${testimonials[index].author}'s testimonial`,
      duration: 1500,
    });
  };

  return (
    <section id="home-testimonials" className="py-20 bg-mansablue relative overflow-hidden">
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
          <h2 className="heading-lg text-white mb-4">Real Results</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Our beta users are already experiencing the power of intentional circulation.
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
                <Quote size={40} />
              </div>
              
              {/* Navigation buttons */}
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
              
              {/* Testimonial content */}
              <div className="pt-8">
                <div className="testimonial-content">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="min-h-[180px]"
                    >
                      <p className="text-xl text-gray-700 mb-6">{testimonials[activeIndex].quote}</p>
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 border-2 border-mansagold/20">
                          <AvatarImage src={testimonials[activeIndex].image} alt={testimonials[activeIndex].author} />
                          <AvatarFallback className="bg-mansablue/10 text-mansablue font-bold">
                            {testimonials[activeIndex].author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="font-semibold text-gray-900">{testimonials[activeIndex].author}</p>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-500 mr-2">{testimonials[activeIndex].title}</p>
                            <div className="flex">
                              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                                <Star key={i} size={12} className="text-mansagold fill-mansagold" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Mobile navigation */}
                <div className="md:hidden flex justify-center space-x-4 mt-8">
                  <button 
                    onClick={handlePrevious}
                    className="bg-mansablue/10 hover:bg-mansablue/20 rounded-full p-2 transition-all"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-5 w-5 text-mansablue" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="bg-mansablue/10 hover:bg-mansablue/20 rounded-full p-2 transition-all"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-5 w-5 text-mansablue" />
                  </button>
                </div>
                
                {/* Dots indicator */}
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => selectTestimonial(index)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300",
                        activeIndex === index 
                          ? "bg-mansablue scale-125" 
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

export default TestimonialsSection;
