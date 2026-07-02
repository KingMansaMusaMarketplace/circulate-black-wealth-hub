import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PromiseBanner: React.FC = () => {
  return (
    <section
      aria-labelledby="promise-banner-heading"
      className="relative py-16 md:py-20 border-y border-mansagold/40 bg-gradient-to-b from-[#050a18] via-[#02040a] to-[#050a18]"
    >
      {/* soft gold glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-24 bg-mansagold/10 blur-3xl rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative container mx-auto px-6 max-w-4xl text-center"
      >
        <p
          id="promise-banner-heading"
          className="text-lg md:text-2xl font-extrabold tracking-[0.25em] text-mansagold uppercase mb-5"
        >
          THE BENEFITS
        </p>

        <p className="text-2xl md:text-4xl font-serif font-light leading-snug text-white">
          <span className="font-semibold text-mansagold">1325.AI</span> helps
          Black-owned businesses <span className="text-white">make more money</span>,{' '}
          <span className="text-white">save time</span>, and{' '}
          <span className="text-white">keep wealth circulating</span> — without hiring a
          full staff or learning new technology.
        </p>

        <Link
          to="/about"
          className="inline-flex items-center gap-2 mt-8 text-sm md:text-base text-mansagold/90 hover:text-mansagold transition-colors font-medium"
        >
          Read our founding story
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
};

export default PromiseBanner;
