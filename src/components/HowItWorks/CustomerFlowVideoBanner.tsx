import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Search, QrCode, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomerFlowVideoBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="customer-flow" className="relative z-10 max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-mansagold/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-mansablue/40 backdrop-blur-xl"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-mansagold/20 rounded-full blur-3xl" />
        <div className="relative p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mansagold bg-mansagold/10 border border-mansagold/30 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3 h-3" /> New Customer? Start Here
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
              How to Save at a <span className="text-mansagold">Black-Owned Business</span> — in 3 Steps
            </h2>
            <p className="text-white/70 text-sm md:text-base mb-4">
              Sign up, find a business near you, and scan the QR code at checkout to get an instant discount and earn loyalty points.
            </p>
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/80">
                <UserPlus className="w-3.5 h-3.5 text-mansagold" /> 1. Sign Up
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/80">
                <Search className="w-3.5 h-3.5 text-mansagold" /> 2. Discover
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/80">
                <QrCode className="w-3.5 h-3.5 text-mansagold" /> 3. Scan & Save
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate('/directory')}
                className="bg-mansagold text-slate-900 hover:bg-mansagold/90 font-bold"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse the Directory
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                variant="outline"
                className="border-mansagold/40 text-white hover:bg-mansagold/10 hover:border-mansagold"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up Free
              </Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <figure className="w-full max-w-md">
              <div className="relative overflow-hidden rounded-xl border border-mansagold/40 bg-black shadow-2xl shadow-mansagold/10 aspect-video">
                <video
                  src="/videos/1325AI-CustomerFlow-3Steps.mp4"
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-cover"
                  aria-label="How to Save at a Black-Owned Business in 3 Steps — 90 second walkthrough"
                />
              </div>
              <figcaption className="text-center text-xs text-white/70 mt-2">
                ▶ <span className="text-mansagold font-semibold">3 Steps to Save & Earn</span> — 90 sec walkthrough
              </figcaption>
            </figure>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CustomerFlowVideoBanner;
