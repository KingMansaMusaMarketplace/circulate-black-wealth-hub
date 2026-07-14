import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Store, ArrowRight } from 'lucide-react';

/**
 * "Why 1325.AI" band — surfaces mission, Kayla AI, and business signup
 * to visitors browsing the directory on the home page. Keeps the story
 * discoverable without pushing it above the fold.
 */
const WhyBand: React.FC = () => {
  return (
    <section className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur mt-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <span className="text-mansagold text-xs font-mono tracking-widest uppercase">
            Why 1325.AI
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-3 font-display">
            More than a directory — a movement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mission */}
          <Link
            to="/about-1325"
            className="group rounded-2xl border border-white/10 hover:border-mansagold/50 bg-white/[0.03] hover:bg-white/[0.06] p-6 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-mansagold/15 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-mansagold" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Our Mission</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Circulating wealth in the Black community — the story behind 1325.AI and the movement.
            </p>
            <span className="inline-flex items-center gap-1 text-mansagold text-sm font-medium mt-4 group-hover:gap-2 transition-all">
              Read the story <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Kayla AI */}
          <Link
            to="/kayla-ai"
            className="group rounded-2xl border border-white/10 hover:border-mansagold/50 bg-white/[0.03] hover:bg-white/[0.06] p-6 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-mansagold/15 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-mansagold" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Meet Kayla AI</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              42 Agentic AI Employees that run marketing, sales, and support for Black-owned businesses.
            </p>
            <span className="inline-flex items-center gap-1 text-mansagold text-sm font-medium mt-4 group-hover:gap-2 transition-all">
              See what Kayla does <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Get Listed */}
          <Link
            to="/business-signup"
            className="group rounded-2xl border border-mansagold/40 hover:border-mansagold bg-gradient-to-br from-mansagold/10 to-mansablue/10 hover:from-mansagold/15 hover:to-mansablue/15 p-6 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-mansagold/25 flex items-center justify-center mb-4">
              <Store className="w-5 h-5 text-mansagold" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Own a business?</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Get listed for as little as $50/year. Reach customers actively searching for Black-owned businesses.
            </p>
            <span className="inline-flex items-center gap-1 text-mansagold text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
              Add your business <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyBand;
