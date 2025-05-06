
import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "I discovered 10 new Black-owned businesses in my city within a week! Mansa Musa Marketplace makes it so easy to support and save.",
      author: "Jasmine Williams",
      title: "Early Beta Tester"
    },
    {
      quote: "As a business owner, I gained 25 new customers the first month. Best $50/month I've ever spent.",
      author: "Marcus Johnson",
      title: "Business Beta Partner"
    },
    {
      quote: "The loyalty points system keeps me coming back. I'm supporting my community AND saving money.",
      author: "Tasha Robinson",
      title: "Marketplace Member"
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
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="mb-4 text-mansagold">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.33333 16H4L8 8H12L9.33333 16ZM21.3333 16H16L20 8H24L21.3333 16Z" fill="currentColor"/>
                  <path d="M9.33333 16V24H16V16H9.33333ZM21.3333 16V24H28V16H21.3333Z" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-gray-700 mb-6">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-mansablue-dark flex items-center justify-center text-white font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
