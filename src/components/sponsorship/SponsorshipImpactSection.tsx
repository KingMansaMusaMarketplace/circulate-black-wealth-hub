
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Building2, Briefcase, Heart, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const formatNumber = (num: number) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

const SponsorshipImpactSection: React.FC = () => {
  const [currentStats, setCurrentStats] = useState({
    businesses: 0,
    members: 0,
    totalValue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.rpc('get_platform_stats');
        if (!error && data) {
          setCurrentStats({
            businesses: data.total_businesses || 0,
            members: data.total_members || 0,
            totalValue: data.total_value || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const visionMetrics = [
    { 
      icon: Building2, 
      currentValue: currentStats.businesses,
      goalValue: 100000, 
      label: 'Businesses',
      sublabel: 'Goal: 100K by 2030',
      color: 'from-amber-400 to-orange-500'
    },
    { 
      icon: DollarSign, 
      currentValue: currentStats.totalValue,
      goalValue: 1000000000,
      prefix: '$',
      label: 'Wealth Circulated',
      sublabel: 'Goal: $1B by 2030',
      color: 'from-emerald-400 to-teal-500'
    },
    { 
      icon: Users, 
      currentValue: currentStats.members,
      goalValue: 1000000, 
      label: 'Community Members',
      sublabel: 'Goal: 1M by 2030',
      color: 'from-blue-400 to-indigo-500'
    },
    { 
      icon: Briefcase, 
      currentValue: 0,
      goalValue: 50000, 
      label: 'Jobs to Create',
      sublabel: 'Goal: 50K by 2030',
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
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/20 border border-mansagold/30 mb-4">
            <Target className="w-4 h-4 text-mansagold" />
            <span className="text-sm font-semibold text-mansagold">Our Vision 2030</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Where We Are & Where We're Going</h2>
          <p className="text-blue-200/70 max-w-2xl mx-auto">
            We just launched! Here's our current progress and ambitious goals. Your sponsorship helps us get there.
          </p>
        </motion.div>

        {/* Vision metrics */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {visionMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 text-center group-hover:border-white/20 group-hover:bg-slate-800/70 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${metric.color} mb-4`}>
                  <metric.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1 font-playfair">
                  {metric.prefix || ''}{formatNumber(metric.currentValue)}
                </div>
                <p className="text-blue-200/80 text-sm md:text-base font-medium mb-2">{metric.label}</p>
                <p className="text-xs text-mansagold/80 font-medium">{metric.sublabel}</p>
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
                with a purpose-driven, growing community of engaged members.
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
