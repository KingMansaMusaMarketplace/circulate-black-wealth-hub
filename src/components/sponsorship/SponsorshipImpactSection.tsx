
import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Building2, Briefcase, Heart } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const AnimatedCounter = ({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const SponsorshipImpactSection: React.FC = () => {
  const impactMetrics = [
    { 
      icon: Building2, 
      value: 2500, 
      suffix: '+',
      label: 'Businesses Supported',
      color: 'from-amber-400 to-orange-500'
    },
    { 
      icon: DollarSign, 
      value: 45,
      suffix: 'M+',
      prefix: '$',
      label: 'Economic Impact Generated',
      color: 'from-emerald-400 to-teal-500'
    },
    { 
      icon: Users, 
      value: 150000, 
      suffix: '+',
      label: 'Community Members',
      color: 'from-blue-400 to-indigo-500'
    },
    { 
      icon: Briefcase, 
      value: 5000, 
      suffix: '+',
      label: 'Jobs Created',
      color: 'from-purple-400 to-pink-500'
    },
  ];

  const impactAreas = [
    {
      icon: TrendingUp,
      title: 'Economic Growth',
      description: 'Direct investment in Black-owned businesses creates ripple effects across entire communities, generating sustainable wealth.',
    },
    {
      icon: Heart,
      title: 'Community Connection',
      description: 'Your partnership builds authentic relationships with engaged consumers who prioritize purpose-driven brands.',
    },
    {
      icon: Users,
      title: 'Generational Impact',
      description: 'Help break economic barriers and create pathways for the next generation of Black entrepreneurs.',
    },
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        {/* Impact metrics */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 blur-xl -z-10"
                   style={{ background: `linear-gradient(135deg, ${metric.color.split(' ')[0].replace('from-', '')} 0%, ${metric.color.split(' ')[1].replace('to-', '')} 100%)` }} />
              <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 text-center group-hover:border-white/20 group-hover:bg-slate-800/70 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${metric.color} mb-4`}>
                  <metric.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 font-playfair">
                  <AnimatedCounter target={metric.value} suffix={metric.suffix} prefix={metric.prefix || ''} />
                </div>
                <p className="text-blue-200/80 text-sm md:text-base font-medium">{metric.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Impact explanation */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-mansagold/5 via-transparent to-mansagold/5 rounded-3xl" />
          <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 md:p-12 lg:p-16">
            <div className="text-center mb-12">
              <motion.span 
                className="inline-block text-mansagold text-sm font-semibold uppercase tracking-widest mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Why Partner With Us
              </motion.span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
                <span className="text-white">Transform Communities, </span>
                <span className="text-gradient-gold">Elevate Your Brand</span>
              </h2>
              <p className="text-xl text-blue-200/80 max-w-3xl mx-auto">
                Your investment creates measurable change while connecting your brand 
                with a purpose-driven audience of over 150,000 engaged community members.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {impactAreas.map((area, index) => (
                <motion.div 
                  key={area.title}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mansagold/10 border border-mansagold/20 mb-6 group-hover:bg-mansagold/20 group-hover:border-mansagold/40 group-hover:scale-110 transition-all duration-300">
                    <area.icon className="w-8 h-8 text-mansagold" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-playfair">{area.title}</h3>
                  <p className="text-blue-200/70 leading-relaxed">{area.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorshipImpactSection;
