
import React from 'react';

const QuoteSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white text-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-rose-400/20 to-pink-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl"></div>
      </div>
      
      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-white/20 shadow-2xl">
          <div className="mb-6 bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent text-7xl md:text-8xl font-bold animate-pulse">
            "
          </div>
          <blockquote className="text-2xl md:text-3xl font-semibold mb-8 leading-relaxed">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Wealth is not created by individuals shouting in isolation.
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-100 via-blue-100 to-indigo-100 bg-clip-text text-transparent">
              Wealth is created by systems — built, protected, and expanded together.
            </span>
            <span className="block mt-6 font-extrabold text-3xl md:text-4xl bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent drop-shadow-lg">
              Mansa Musa Marketplace is your system.
            </span>
            <span className="block mt-3 text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-200 via-rose-200 to-red-200 bg-clip-text text-transparent">
              Now circulate, build, and lead.
            </span>
          </blockquote>
          <footer className="font-bold text-lg md:text-xl flex items-center justify-center">
            <div className="h-1 w-12 md:w-16 bg-gradient-to-r from-transparent via-yellow-400 to-amber-400 mr-4 rounded-full shadow-lg"></div>
            <span className="bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent font-extrabold">
              Thomas D. Bowling
            </span>
            <div className="h-1 w-12 md:w-16 bg-gradient-to-r from-amber-400 via-yellow-400 to-transparent ml-4 rounded-full shadow-lg"></div>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
