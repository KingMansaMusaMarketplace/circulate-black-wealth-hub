import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Database, Sparkles } from 'lucide-react';
import neuralBrainLogo from '@/assets/1325-neural-brain-logo.jpeg';

const PitchSlide1Cover: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center px-8 py-12">
      <div className="max-w-5xl mx-auto text-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-20 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-mansablue-light/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {/* 1325.AI Neural Brain Logo */}
          <motion.div 
            className="w-32 h-32 mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 20px rgba(245, 166, 35, 0.5))" }}
          >
            <img 
              src={neuralBrainLogo} 
              alt="1325.AI Neural Brain Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>

          <Badge className="mb-6 bg-mansagold/20 text-mansagold border-mansagold/30 text-lg px-6 py-2">
            <Database className="w-4 h-4 mr-2" />
            Investor Presentation 2026
          </Badge>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-white">Mansa Musa</span>
            <br />
            <span className="bg-gradient-to-r from-mansagold via-mansagold-light to-mansagold bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-white/90 mb-4 font-light max-w-4xl mx-auto">
            The Economic Operating System for the Black Economy
          </p>

          <motion.div 
            className="mt-10 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="text-xl text-mansagold font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              "We don't just know where Black consumers shop.
            </p>
            <p className="text-xl text-mansagold font-semibold">
              We own the ledger."
            </p>
          </motion.div>

          <motion.div 
            className="mt-12 flex items-center justify-center gap-8 text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-mansagold">$1.6T</div>
              <div className="text-sm">Market Size</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Patent</div>
              <div className="text-sm">Pending Tech</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-mansagold">6</div>
              <div className="text-sm">Revenue Streams</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchSlide1Cover;
