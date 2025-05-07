
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AnimatedTestimonial, TestimonialNavigation, TestimonialDots } from '@/components/HowItWorks/Testimonials';
import { testimonials } from '@/components/HowItWorks/Testimonials/testimonialData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const TestimonialsPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handlePrevious = () => {
    if (animating) return;
    setAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setAnimating(false), 500);
  };

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setAnimating(false), 500);
  };

  const handleDotClick = (index: number) => {
    if (animating || index === activeIndex) return;
    setAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setAnimating(false), 500);
  };

  useEffect(() => {
    // Auto-advance testimonials every 8 seconds
    const interval = setInterval(() => {
      handleNext();
    }, 8000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-mansablue to-mansablue-dark text-white py-16">
          <div className="container-custom">
            <h1 className="heading-xl mb-4 text-center">
              Hear From Our Community
            </h1>
            <p className="text-lg text-center mx-auto max-w-2xl mb-8">
              Real stories from real people who are circulating wealth within the Black community
            </p>
          </div>
        </div>

        {/* Testimonials Showcase */}
        <div className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="relative max-w-3xl mx-auto">
              <AnimatedTestimonial 
                testimonial={testimonials[activeIndex]} 
                key={`testimonial-${activeIndex}`} 
              />
              
              <TestimonialNavigation 
                onPrevious={handlePrevious} 
                onNext={handleNext} 
              />
            </div>
            
            <TestimonialDots 
              count={testimonials.length} 
              activeIndex={activeIndex} 
              onDotClick={handleDotClick} 
            />
          </div>
        </div>

        {/* Featured Testimonials Grid */}
        <div className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="heading-lg mb-8 text-center">More Stories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, idx) => (
                <Card key={idx} className="overflow-hidden transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-mansablue/20 flex items-center justify-center mr-4">
                        <span className="text-mansablue font-bold">{testimonial.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">"{testimonial.quote.substring(0, 120)}..."</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-mansagold py-16">
          <div className="container-custom text-center">
            <h2 className="heading-lg text-white mb-4">Join Our Community Today</h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Be part of the movement to circulate Black wealth and create lasting economic change in our communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-mansagold hover:bg-gray-100">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
