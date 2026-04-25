import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, GraduationCap, Cpu, Building2, FileBadge } from 'lucide-react';

const marks = [
  { icon: FileBadge, label: 'USPTO Filing 63/969,202' },
  { icon: ShieldCheck, label: 'Verified Corporation' },
  { icon: Building2, label: 'Illinois Registered LLC' },
  { icon: GraduationCap, label: 'HBCU Partner Network' },
  { icon: Cpu, label: '33-Agent AI Workforce' },
  { icon: Award, label: 'SOC 2 Roadmap 2026' },
];

const RecognitionStrip: React.FC = () => {
  return (
    <section className="relative z-10 py-10 border-y border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <p className="text-center text-[10px] md:text-xs text-white/35 tracking-[0.3em] uppercase mb-6">
          Built on verified, defensible infrastructure
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
          {marks.map((mark, i) => (
            <motion.div
              key={mark.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
            >
              <mark.icon className="w-4 h-4 text-mansagold/70" />
              <span className="text-xs md:text-sm font-medium tracking-wide">{mark.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecognitionStrip;
