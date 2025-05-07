
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronRight, PauseCircle, PlayCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type TestimonialType = 'all' | 'customer' | 'business';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  type: TestimonialType;
}

const TestimonialsSection = () => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [filter, setFilter] = useState<TestimonialType>('all');
  
  const testimonials: Testimonial[] = [
    {
      name: "James Wilson",
      role: "Customer",
      content: "I've saved over $200 in my first month using Mansa Musa Marketplace. The app makes it easy to find quality Black-owned businesses in my neighborhood.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      type: "customer"
    },
    {
      name: "Michelle Johnson",
      role: "Business Owner",
      content: "Since joining Mansa Musa Marketplace, my customer base has grown by 40%. The platform brings in customers who are genuinely committed to supporting Black businesses.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      type: "business"
    },
    {
      name: "David Thompson",
      role: "Customer",
      content: "The loyalty program is a game-changer. I've earned enough points to get significant discounts at my favorite restaurants and stores.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      type: "customer"
    },
    {
      name: "Alisha Brown",
      role: "Business Owner",
      content: "As a small business owner, visibility is everything. Mansa Musa Marketplace has connected me with customers I wouldn't have reached otherwise.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      type: "business"
    },
    {
      name: "Marcus Lee",
      role: "Customer",
      content: "I appreciate how easy the app makes it to discover Black-owned businesses. It's become my go-to resource when I'm looking for new places to support.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/53.jpg",
      type: "customer"
    },
    {
      name: "Keisha Davis",
      role: "Business Owner",
      content: "The analytics tools have helped me understand my customers better. I've been able to adjust my offerings based on real data and it's made a huge difference.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      type: "business"
    },
    {
      name: "Terrell Washington",
      role: "Customer",
      content: "The community events organized through the app have been amazing. I've made connections with like-minded individuals all focused on supporting our community.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/42.jpg",
      type: "customer"
    }
  ];

  const filteredTestimonials = testimonials.filter(
    t => filter === 'all' || t.type === filter
  );

  // Auto-advance carousel
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && filteredTestimonials.length > 0) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => 
          prevIndex === filteredTestimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, filteredTestimonials.length]);

  // Handle testimonial filter change
  const handleFilterChange = (type: TestimonialType) => {
    setFilter(type);
    setActiveIndex(0); // Reset to first testimonial when filter changes
  };

  // Handle carousel change
  const handleCarouselChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);
  
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="heading-lg text-mansablue mb-3 md:mb-4">What Our Community Says</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Real experiences from customers and business owners in our marketplace.
          </p>
          
          {/* Filter controls */}
          <div className="flex justify-center gap-3 mt-6">
            <Button 
              variant={filter === 'all' ? "default" : "outline"} 
              size="sm"
              onClick={() => handleFilterChange('all')}
              className="transition-all duration-300"
            >
              All
            </Button>
            <Button 
              variant={filter === 'customer' ? "default" : "outline"} 
              size="sm"
              onClick={() => handleFilterChange('customer')}
              className="transition-all duration-300"
            >
              Customers
            </Button>
            <Button 
              variant={filter === 'business' ? "default" : "outline"} 
              size="sm"
              onClick={() => handleFilterChange('business')}
              className="transition-all duration-300"
            >
              Business Owners
            </Button>
          </div>
        </div>

        <div className="relative px-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
            onSelect={(api) => {
              const selectedIndex = api?.selectedScrollSnap();
              if (selectedIndex !== undefined) {
                handleCarouselChange(selectedIndex);
              }
            }}
          >
            <CarouselContent>
              {filteredTestimonials.map((testimonial, index) => (
                <CarouselItem key={index} className={`${isMobile ? 'basis-full' : 'basis-1/3'} pl-4 transition-opacity duration-500 ${activeIndex === index ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="p-1">
                    <Card 
                      className={`border-mansagold/20 hover:shadow-lg transition-all duration-300 h-full ${activeIndex === index ? 'scale-[1.02]' : 'scale-100'}`}
                    >
                      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex flex-col h-full`}>
                        <div className="flex items-center mb-3 md:mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} fill-mansagold text-mansagold`} />
                          ))}
                          <span className="ml-2 text-xs text-gray-500">
                            {testimonial.type === 'customer' ? 'Customer' : 'Business'}
                          </span>
                        </div>
                        <p className={`text-gray-700 mb-4 md:mb-6 italic ${isMobile ? 'text-sm' : 'text-base'} flex-grow`}>
                          "{testimonial.content}"
                        </p>
                        <div className="border-t pt-3 md:pt-4 flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                            <img 
                              src={testimonial.image} 
                              alt={`${testimonial.name}'s profile`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <p className="font-bold">{testimonial.name}</p>
                            <p className="text-gray-500 text-xs md:text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {!isMobile && (
              <>
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
              </>
            )}
          </Carousel>
          
          {isMobile && (
            <div className="flex justify-center mt-8" aria-hidden="true">
              <span className="text-mansablue text-sm font-medium">Swipe for more testimonials →</span>
            </div>
          )}
          
          {/* Autoplay controls and pagination dots */}
          <div className="flex flex-col items-center mt-6 gap-3">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
              >
                {isPlaying ? (
                  <PauseCircle className="h-5 w-5 text-mansablue" />
                ) : (
                  <PlayCircle className="h-5 w-5 text-mansablue" />
                )}
              </Button>
              <div className="flex gap-1">
                {filteredTestimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`block h-2 w-2 rounded-full transition-all duration-300 ${
                      activeIndex === index 
                        ? "bg-mansagold w-4" 
                        : "bg-mansagold opacity-30"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                    onClick={() => handleCarouselChange(index)}
                  />
                ))}
              </div>
            </div>
            
            <Link to="/testimonials" className="inline-flex items-center text-mansablue hover:text-mansablue-dark mt-2 transition-colors">
              <span className="text-sm font-medium">View all testimonials</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
