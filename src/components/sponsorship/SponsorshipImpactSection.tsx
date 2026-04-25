import React from 'react';
import { motion } from 'framer-motion';

const metrics = [
  { value: '33', unit: 'AI Agents', detail: 'Autonomous workforce led by Kayla, our CEO agent.' },
  { value: '8', unit: 'Revenue Streams', detail: 'Subscriptions, sponsorships, B2B, stays, rideshare and more.' },
  { value: '$12,100+', unit: '/mo Saved', detail: 'Operator savings vs. traditional staffing for an SMB.' },
  { value: '$1.8T', unit: 'Addressable', detail: 'Black-owned business economy we are building rails for.' },
];

const pillars = [
  {
    title: 'Economic Circulation',
    body: 'Direct, measured investment in verified Black-owned businesses — with dashboards that track every dollar of community impact.',
  },
  {
    title: 'Brand Alignment',
    body: 'Authentic association with a purpose-driven, growing audience that prioritizes brands they believe in.',
  },
  {
    title: 'Generational Infrastructure',
    body: 'Patent-pending technology, an HBCU pipeline, and a 33-agent AI workforce building durable wealth — not short-term campaigns.',
  },
];

const SponsorshipImpactSection: React.FC = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-4">By the numbers</p>
          <h2 className="font-playfair text-3xl md:text-5xl font-semibold text-white tracking-tight">
            A measurable institution, not a campaign.
          </h2>
          <div className="w-16 h-px bg-mansagold/60 mx-auto mt-8" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden mb-24 max-w-6xl mx-auto">
          {metrics.map((m, i) => (
            <motion.div
              key={m.unit}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-black p-8 md:p-10 text-center"
            >
              <div className="font-playfair text-4xl md:text-5xl font-semibold text-white mb-2">
                {m.value}
              </div>
              <p className="text-mansagold text-xs md:text-sm tracking-widest uppercase mb-4">
                {m.unit}
              </p>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed">{m.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-4">Why partner</p>
            <h3 className="font-playfair text-2xl md:text-4xl font-semibold text-white tracking-tight">
              Three pillars of measurable impact.
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-black p-10"
              >
                <p className="font-playfair text-mansagold/60 text-sm mb-3">0{i + 1}</p>
                <h4 className="font-playfair text-xl font-semibold text-white mb-4">{p.title}</h4>
                <p className="text-white/55 text-sm leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorshipImpactSection;
