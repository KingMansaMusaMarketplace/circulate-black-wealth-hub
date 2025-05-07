
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TestimonialType = 'all' | 'customer' | 'business';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  type: TestimonialType;
}

const TestimonialsPage = () => {
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
    },
    {
      name: "Jasmine King",
      role: "Customer",
      content: "I love how the app highlights businesses I'd never have discovered otherwise. It's opened up a whole new world of shopping options for me and my family.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      type: "customer"
    },
    {
      name: "Omar Richardson",
      role: "Business Owner",
      content: "The loyalty program has significantly increased customer retention for my business. People keep coming back because they know they're getting value.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/91.jpg",
      type: "business"
    },
    {
      name: "Tanya Williams",
      role: "Business Owner",
      content: "As a new business owner, Mansa Musa Marketplace gave me the visibility I needed to get started. I couldn't have grown as quickly without this platform.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/women/90.jpg",
      type: "business"
    }
  ];

  const filteredTestimonials = testimonials.filter(
    t => filter === 'all' || t.type === filter
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-b from-mansablue to-mansablue-dark text-white">
          <div className="container-custom text-center px-4">
            <h1 className="heading-lg mb-4">Community Testimonials</h1>
            <p className="max-w-2xl mx-auto text-white/80">
              Hear from customers and business owners who are part of our growing economic movement.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-custom px-4">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button 
                variant={filter === 'all' ? "default" : "outline"} 
                onClick={() => setFilter('all')}
                className="transition-all duration-300"
              >
                All Testimonials
              </Button>
              <Button 
                variant={filter === 'customer' ? "default" : "outline"} 
                onClick={() => setFilter('customer')}
                className="transition-all duration-300"
              >
                Customer Experiences
              </Button>
              <Button 
                variant={filter === 'business' ? "default" : "outline"} 
                onClick={() => setFilter('business')}
                className="transition-all duration-300"
              >
                Business Owner Stories
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((testimonial, index) => (
                <Card 
                  key={index} 
                  className="border-mansagold/20 hover:shadow-lg transition-all duration-300 h-full transform hover:-translate-y-1"
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-mansagold text-mansagold" />
                      ))}
                      <span className="ml-auto text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {testimonial.type === 'customer' ? 'Customer' : 'Business Owner'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-6 italic flex-grow">
                      "{testimonial.content}"
                    </p>
                    <div className="border-t pt-4 flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img 
                          src={testimonial.image} 
                          alt={`${testimonial.name}'s profile`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{testimonial.name}</p>
                        <p className="text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTestimonials.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No testimonials found matching your filter.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
