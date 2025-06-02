
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    content: "Implementing Mansa Musa's loyalty program increased our customer return rate by 40% in just two months. The QR code system is so easy for both our staff and customers.",
    author: "Sarah Johnson",
    role: "Owner, The Cozy Corner Cafe",
    avatar: "SJ",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    content: "As a customer, I love collecting points at my favorite shops. I've already redeemed rewards at three different businesses, and the experience was seamless.",
    author: "Marcus Chen",
    role: "Loyal Customer",
    avatar: "MC",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    content: "The analytics provided by Mansa Musa have completely transformed how we approach our marketing. We now know exactly what brings customers back.",
    author: "Priya Patel",
    role: "Marketing Director, Urban Fitness",
    avatar: "PP",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Join thousands of satisfied businesses and customers
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} alt={testimonial.author} />
                      <AvatarFallback className="bg-mansablue text-white">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
