import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowRight, QrCode, TrendingUp, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VendorOnboardingVideoBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="vendor-onboarding" className="relative z-10 max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-mansagold/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-mansablue/40 backdrop-blur-xl"
      >
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-mansagold/20 rounded-full blur-3xl" />
        <div className="relative p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center">
          <div className="md:order-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mansagold bg-mansagold/10 border border-mansagold/30 px-3 py-1 rounded-full mb-3">
              <Store className="w-3 h-3" /> Own a Business? Start Here
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
              How to List Your <span className="text-mansagold">Black-Owned Business</span> — in 3 Steps
            </h2>
            <p className="text-white/70 text-sm md:text-base mb-4">
              List your business free, print your unique QR code, and let Kayla AI bring you new customers — on autopilot.
            </p>
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/80">
                <ClipboardList className="w-3.5 h-3.5 text-mansagold" /> 1. Claim Listing
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/80">
                <QrCode className="w-3.5 h-3.5 text-mansagold" /> 2. Print QR
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/80">
                <TrendingUp className="w-3.5 h-3.5 text-mansagold" /> 3. Grow With Kayla
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate('/business-signup')}
                className="bg-mansagold text-slate-900 hover:bg-mansagold/90 font-bold"
              >
                <Store className="w-4 h-4 mr-2" />
                List Your Business Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => navigate('/claim-business')}
                variant="outline"
                className="border-mansagold/40 text-white hover:bg-mansagold/10 hover:border-mansagold"
              >
                Claim Existing Listing
              </Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-start md:order-1">
            <figure className="w-full max-w-md">
              <div className="relative overflow-hidden rounded-xl border border-mansagold/40 bg-black shadow-2xl shadow-mansagold/10 aspect-video">
                <video
                  src="/videos/1325AI-VendorOnboarding-3Steps.mp4"
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-cover"
                  aria-label="How to List Your Business on 1325.AI in 3 Steps — 90 second walkthrough"
                />
              </div>
              <figcaption className="text-center text-xs text-white/70 mt-2">
                ▶ <span className="text-mansagold font-semibold">3 Steps to List & Grow</span> — 90 sec walkthrough
              </figcaption>
            </figure>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VendorOnboardingVideoBanner;
