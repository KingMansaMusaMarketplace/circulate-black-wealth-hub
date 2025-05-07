
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const TestimonialsSection = () => {
  const isMobile = useIsMobile();
  
  const testimonials = [
    {
      name: "James Wilson",
      role: "Customer",
      content: "I've saved over $200 in my first month using Mansa Musa Marketplace. The app makes it easy to find quality Black-owned businesses in my neighborhood.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg" 
    },
    {
      name: "Michelle Johnson",
      role: "Business Owner",
      content: "Since joining Mansa Musa Marketplace, my customer base has grown by 40%. The platform brings in customers who are genuinely committed to supporting Black businesses.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "David Thompson",
      role: "Customer",
      content: "The loyalty program is a game-changer. I've earned enough points to get significant discounts at my favorite restaurants and stores.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      name: "Alisha Brown",
      role: "Business Owner",
      content: "As a small business owner, visibility is everything. Mansa Musa Marketplace has connected me with customers I wouldn't have reached otherwise.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    {
      name: "Marcus Lee",
      role: "Customer",
      content: "I appreciate how easy the app makes it to discover Black-owned businesses. It's become my go-to resource when I'm looking for new places to support.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/53.jpg"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="heading-lg text-mansablue mb-3 md:mb-4">What Our Community Says</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Real experiences from customers and business owners in our marketplace.
          </p>
        </div>

        <div className="relative px-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className={`${isMobile ? 'basis-full' : 'basis-1/3'} pl-4`}>
                  <div className="p-1">
                    <Card 
                      className="border-mansagold/20 hover:shadow-lg transition-all duration-300 h-full"
                    >
                      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex flex-col h-full`}>
                        <div className="flex items-center mb-3 md:mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} fill-mansagold text-mansagold`} />
                          ))}
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
          
          <div className="flex justify-center gap-1 mt-6">
            {testimonials.map((_, index) => (
              <span 
                key={index} 
                className="block h-2 w-2 rounded-full bg-mansagold opacity-50"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
