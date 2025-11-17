
import React from 'react';

const QuoteSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-mansablue-dark via-blue-800 to-blue-900 text-white text-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-mansagold/20 to-amber-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/10 to-mansablue/10 blur-3xl"></div>
      </div>
      
      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-white/20 shadow-2xl">
          <div className="mb-6 bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent text-7xl md:text-8xl font-bold animate-pulse">
            "
          </div>
          <blockquote className="text-2xl md:text-3xl font-semibold mb-8 leading-relaxed">
            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Wealth is not created by individuals shouting in isolation.
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-100 via-white to-amber-100 bg-clip-text text-transparent">
              Wealth is created by systems — built, protected, and expanded together.
            </span>
            <span className="block mt-6 font-extrabold text-3xl md:text-4xl bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
              Mansa Musa Marketplace is your system.
            </span>
            <span className="block mt-3 text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-200 to-white bg-clip-text text-transparent">
              Now circulate, build, and lead.
            </span>
          </blockquote>
          <footer className="font-bold text-lg md:text-xl flex items-center justify-center">
            <div className="h-1 w-12 md:w-16 bg-gradient-to-r from-transparent via-mansagold to-amber-500 mr-4 rounded-full shadow-lg"></div>
            <span className="bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400 bg-clip-text text-transparent font-extrabold">
              Thomas D. Bowling
            </span>
            <div className="h-1 w-12 md:w-16 bg-gradient-to-r from-amber-500 via-mansagold to-transparent ml-4 rounded-full shadow-lg"></div>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
