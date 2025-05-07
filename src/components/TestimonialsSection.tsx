
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote: "I discovered 10 new Black-owned businesses in my city within a week! Mansa Musa Marketplace makes it so easy to support and save.",
      author: "Jasmine Williams",
      title: "Early Beta Tester",
      image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsYWNrJTIwbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      rating: 5
    },
    {
      quote: "As a business owner, I gained 25 new customers the first month. Best $50/month I've ever spent.",
      author: "Marcus Johnson",
      title: "Business Beta Partner",
      image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsYWNrJTIwd29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
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

  return (
    <section className="py-20 bg-mansablue">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg text-white mb-4">Real Results</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Our beta users are already experiencing the power of intentional circulation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="mb-4 text-mansagold">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.33333 16H4L8 8H12L9.33333 16ZM21.3333 16H16L20 8H24L21.3333 16Z" fill="currentColor"/>
                  <path d="M9.33333 16V24H16V16H9.33333ZM21.3333 16V24H28V16H21.3333Z" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-gray-700 mb-6">{testimonial.quote}</p>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 border-2 border-mansablue/10">
                  <AvatarImage src={testimonial.image} alt={testimonial.author} />
                  <AvatarFallback className="bg-mansablue/10 text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 mr-2">{testimonial.title}</p>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={12} className="text-mansagold fill-mansagold" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
