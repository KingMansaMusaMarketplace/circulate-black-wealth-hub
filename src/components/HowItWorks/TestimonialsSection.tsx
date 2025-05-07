
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "James Wilson",
      role: "Customer",
      content: "I've saved over $200 in my first month using Mansa Musa Marketplace. The app makes it easy to find quality Black-owned businesses in my neighborhood.",
      rating: 5
    },
    {
      name: "Michelle Johnson",
      role: "Business Owner",
      content: "Since joining Mansa Musa Marketplace, my customer base has grown by 40%. The platform brings in customers who are genuinely committed to supporting Black businesses.",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "Customer",
      content: "The loyalty program is a game-changer. I've earned enough points to get significant discounts at my favorite restaurants and stores.",
      rating: 4
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg text-mansablue mb-4">What Our Community Says</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences from customers and business owners in our marketplace.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-mansagold/20 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-mansagold text-mansagold" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
