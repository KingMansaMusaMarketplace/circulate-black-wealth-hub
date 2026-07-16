import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote } from 'lucide-react';

/**
 * "Meet the Founder" strip — surfaces Thomas D. Bowling and the 40-year
 * journey on the homepage, linking visitors to the full About page.
 */
const MeetFounderStrip: React.FC = () => {
  return (
    <section className="relative z-10 border-t border-white/10 bg-gradient-to-br from-mansablue/20 via-black/60 to-mansablue/10 backdrop-blur">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Founder photo */}
          <div className="shrink-0 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-mansagold via-amber-400 to-mansagold rounded-2xl blur-md opacity-60" />
            <img
              src="/lovable-uploads/1dd9f7bc-bb83-4c92-b250-e11f63790f8c.png"
              alt="Thomas D. Bowling, Founder of 1325.AI"
              style={{ objectPosition: 'center top' }}
              className="relative w-40 h-48 sm:w-56 sm:h-64 object-cover rounded-2xl border-2 border-white/20 shadow-2xl"
            />
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <span className="text-mansagold text-xs font-mono tracking-widest uppercase">
              Meet the Founder
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mt-3 font-display">
              Thomas D. Bowling
            </h2>
            <p className="text-white/70 text-sm md:text-base mt-1">
              Founder & Chief Architect of Economic Infrastructure
            </p>

            <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 relative">
              <Quote className="absolute top-4 left-4 w-6 h-6 text-mansagold/40" />
              <p className="text-white/90 text-base md:text-lg leading-relaxed pl-8">
                For four decades, I've walked the path of Black entrepreneurship, building
                systems that help dollars circulate inside our community instead of leaving it.
                <span className="text-mansagold font-medium"> 1325.AI is the blueprint I wish I had when I started.</span>
              </p>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-6 text-mansagold font-medium hover:gap-3 transition-all"
            >
              Read the full founder story
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetFounderStrip;
