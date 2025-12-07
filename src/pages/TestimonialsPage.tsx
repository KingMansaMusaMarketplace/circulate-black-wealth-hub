
import React from 'react';
import { Helmet } from 'react-helmet-async';
import TestimonialsSection from '@/components/TestimonialsSection';
import { MessageSquare, Sparkles } from 'lucide-react';

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      <Helmet>
        <title>Testimonials | Mansa Musa Marketplace</title>
        <meta name="description" content="Read success stories and testimonials from businesses and customers using Mansa Musa Marketplace." />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-[400px] h-[400px] bg-mansagold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-mansagold/20 to-amber-500/20 border border-mansagold/30 mb-6">
              <MessageSquare className="h-10 w-10 text-mansagold" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-display">
              <span className="text-white">Success </span>
              <span className="bg-gradient-to-r from-mansagold via-amber-400 to-mansagold bg-clip-text text-transparent">Stories</span>
            </h1>
            <p className="text-xl text-blue-100/90 max-w-2xl mx-auto">
              Hear from businesses and customers who are creating economic impact through our platform.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10">
        <TestimonialsSection />
      </section>
    </div>
  );
};

export default TestimonialsPage;
