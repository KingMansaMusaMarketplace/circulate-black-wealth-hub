import React from 'react';
import { motion } from 'framer-motion';

const FounderNoteSection: React.FC = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative bg-black border border-white/10 rounded-2xl p-10 md:p-14">
            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-mansagold/60 to-transparent" />

            <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-6">A note from the founder</p>

            <blockquote className="font-playfair text-xl md:text-2xl text-white/90 leading-relaxed italic mb-8">
              "We built 1325.AI because the data is undeniable: a dollar circulates in the Black community
              for hours, not days. Sponsorship of this platform is not philanthropy — it is infrastructure
              investment in a $1.8 trillion economy. I'd be honored to discuss how your brand fits in."
            </blockquote>

            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mansagold to-amber-700 flex items-center justify-center font-playfair text-slate-900 font-bold text-lg">
                TB
              </div>
              <div>
                <p className="text-white font-semibold">Thomas D. Bowling</p>
                <p className="text-white/50 text-sm">Founder, Chairman & Chief Architect, 1325.AI</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderNoteSection;
