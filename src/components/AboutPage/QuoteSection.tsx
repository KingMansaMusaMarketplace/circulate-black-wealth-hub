
import React from 'react';

const QuoteSection = () => {
  return (
    <section className="py-20 bg-mansablue text-white text-center">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 text-mansagold text-6xl opacity-60">
            "
          </div>
          <blockquote className="text-2xl font-medium mb-8 leading-relaxed">
            Wealth is not created by individuals shouting in isolation.
            Wealth is created by systems — built, protected, and expanded together.
            <span className="block mt-4 font-bold text-mansagold">Mansa Musa Marketplace is your system.</span>
            <span className="block mt-2">Now circulate, build, and lead.</span>
          </blockquote>
          <footer className="font-bold flex items-center justify-center">
            <div className="h-0.5 w-10 bg-mansagold/60 mr-3"></div>
            Thomas D. Bowling
            <div className="h-0.5 w-10 bg-mansagold/60 ml-3"></div>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
