import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative px-6 py-24 md:py-32 border-b border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-10 border border-mansagold/30 rounded-full bg-mansagold/5">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-mansagold" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-mansagold font-medium">
            About 1325.AI
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-light text-white leading-[1.1] mb-8">
          The economic operating system for the{' '}
          <span className="text-mansagold">$12 trillion</span> global Black economy.
        </h1>

        <p className="text-lg md:text-xl text-zinc-300 font-light leading-relaxed max-w-3xl mb-10">
          1325.AI is the infrastructure layer for circulating Black dollars intentionally,
          systemically, and sustainably — verified businesses, loyalty rails, and an agentic
          AI workforce, built as one system.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/how-it-works"
            className="px-8 py-4 bg-mansagold text-black font-bold uppercase tracking-widest text-xs rounded-sm transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2 group"
          >
            How It Works
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/directory"
            className="px-8 py-4 border border-white/30 text-white font-bold uppercase tracking-widest text-xs rounded-sm transition-colors hover:border-mansagold hover:text-mansagold"
          >
            Browse the Directory
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
