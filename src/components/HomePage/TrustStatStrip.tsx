import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '$12,100+/mo', label: 'Avg. business savings with Kayla' },
  { value: '~4 Roles Covered', label: 'Sales, marketing, support, ops' },
  { value: '24/7', label: 'AI employee uptime' },
  { value: '100%', label: 'Black-owned & verified' },
];

const TrustStatStrip: React.FC = () => {
  return (
    <section
      aria-label="Platform trust and credibility stats"
      className="py-8 md:py-10 bg-slate-900/40 backdrop-blur-xl border-y border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-mansagold leading-tight">
                {stat.value}
              </div>
              <div className="mt-1.5 text-xs md:text-sm text-white/70 leading-snug">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStatStrip;
