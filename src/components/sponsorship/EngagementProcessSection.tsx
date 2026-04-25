import React from 'react';
import { motion } from 'framer-motion';
import { Phone, FileText, Handshake, Rocket, BarChart3 } from 'lucide-react';

const steps = [
  {
    n: '01',
    icon: Phone,
    title: 'Discovery Call',
    detail: '30 minutes with our partnerships lead to align on objectives and target communities.',
  },
  {
    n: '02',
    icon: FileText,
    title: 'Partnership Brief',
    detail: 'A custom proposal delivered within 5 business days, with measurable KPIs.',
  },
  {
    n: '03',
    icon: Handshake,
    title: 'Agreement & Onboarding',
    detail: 'Legal review, brand-asset intake, and analytics dashboard provisioning.',
  },
  {
    n: '04',
    icon: Rocket,
    title: 'Activation',
    detail: 'Logo placement, directory features, co-marketing, and community programs go live.',
  },
  {
    n: '05',
    icon: BarChart3,
    title: 'Quarterly Business Review',
    detail: 'Verified impact reporting, ROI analysis, and renewal planning.',
  },
];

const EngagementProcessSection: React.FC = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] text-mansagold tracking-[0.3em] uppercase mb-4">The Engagement</p>
          <h2 className="font-playfair text-3xl md:text-5xl font-semibold text-white tracking-tight">
            How a partnership unfolds.
          </h2>
          <div className="w-16 h-px bg-mansagold/60 mx-auto mt-8" />
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-mansagold/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative text-center px-3"
              >
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-5">
                  <div className="absolute inset-0 rounded-full bg-black border border-mansagold/40" />
                  <step.icon className="relative w-7 h-7 text-mansagold" />
                </div>
                <p className="font-playfair text-mansagold/70 text-sm tracking-widest mb-2">{step.n}</p>
                <h3 className="font-playfair text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{step.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementProcessSection;
