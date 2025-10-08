
import React from 'react';
import { Helmet } from 'react-helmet';
import TestimonialsSection from '@/components/TestimonialsSection';

const TestimonialsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Testimonials - Mansa Musa Marketplace</title>
        <meta name="description" content="Read success stories and testimonials from businesses and customers using Mansa Musa Marketplace." />
      </Helmet>

      <main className="flex-grow">
        <div className="bg-mansablue py-16">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Success Stories</h1>
            <p className="text-white/80 mt-4 max-w-2xl">
              Hear from businesses and customers who are creating economic impact through our platform.
            </p>
          </div>
        </div>
        <TestimonialsSection />
      </main>
    </div>
  );
};

export default TestimonialsPage;
