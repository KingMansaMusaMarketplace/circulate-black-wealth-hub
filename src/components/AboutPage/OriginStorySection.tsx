import React from 'react';
import { motion } from 'framer-motion';

const OriginStorySection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle gold accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mansagold/40 to-transparent" />

      <div className="container-custom px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-mansagold font-mono text-sm tracking-[0.3em] uppercase">Origin Story</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 leading-tight">
              Why <span className="text-mansagold">1325</span>?
            </h2>
          </motion.div>

          {/* The Story */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10"
            >
              <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-6">
                In <span className="text-mansagold font-bold">1325 CE</span>, Mansa Musa I — the Emperor of the Mali Empire — 
                embarked on a pilgrimage to Mecca. Along the way, he distributed so much gold that he 
                <span className="text-mansagold font-medium"> single-handedly crashed the economies</span> of every city he passed through. 
                It took over a decade for gold prices to recover.
              </p>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Historians estimate his wealth at over <span className="font-bold text-white">$400 billion</span> in today's dollars — 
                making him the wealthiest person in recorded human history. But Mansa Musa's legacy isn't just about 
                personal wealth. It's about what he <em>built</em>: universities, mosques, trade routes, and entire 
                economic systems that sustained the Mali Empire for generations.
              </p>
              <p className="text-white/80 text-lg leading-relaxed">
                He proved that when wealth is <span className="text-mansagold font-medium">circulated intentionally</span> — 
                invested in infrastructure, education, and community — it doesn't just accumulate. 
                It <em>multiplies</em>.
              </p>
            </motion.div>

            {/* The Connection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-mansagold/10 to-amber-500/5 border border-mansagold/20 rounded-2xl p-8 md:p-10"
            >
              <h3 className="text-2xl font-bold text-mansagold mb-4">The Name Is the Mission</h3>
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                <strong className="text-white">1325.AI</strong> isn't just a name — it's a thesis. The year 1325 represents the moment 
                one man demonstrated what's possible when economic power is wielded with intention. 
                The <strong className="text-white">.AI</strong> represents the modern tools we use to rebuild that same infrastructure 
                — digitally, systemically, and at scale.
              </p>
              <p className="text-white/80 text-lg leading-relaxed">
                Today, the Black dollar leaves our community in under six hours. In other communities, 
                it circulates for 28+ days. 1325.AI exists to close that gap — not through charity, 
                but through <span className="text-mansagold font-medium">engineered economic infrastructure</span> that 
                makes intentional spending effortless, rewarding, and generational.
              </p>
            </motion.div>

            {/* Key stat */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-8 py-4">
                <span className="text-4xl md:text-5xl font-bold text-mansagold font-mono">1325</span>
                <div className="h-10 w-px bg-white/20" />
                <div className="text-left">
                  <p className="text-white font-medium text-sm">The year wealth moved empires.</p>
                  <p className="text-white/50 text-sm">The platform that moves it again.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OriginStorySection;
