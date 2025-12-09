import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, DollarSign, Building2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, useInView } from 'framer-motion';

interface ImpactStats {
  totalBusinesses: number;
  totalTransactions: number;
  totalValue: number;
  totalCustomers: number;
}

const AnimatedCounter = ({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) => {
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

  const formatValue = (value: number) => {
    if (prefix === '$') {
      if (value >= 1000000) return `${prefix}${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${prefix}${(value / 1000).toFixed(1)}K`;
      return `${prefix}${value}`;
    }
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K${suffix}`;
    return `${value}${suffix}`;
  };

  return <span ref={ref} className="tabular-nums">{formatValue(count)}</span>;
};

// Get honest, contextual label based on the count
const getHonestLabel = (type: 'businesses' | 'members' | 'transactions' | 'value', count: number): string => {
  if (type === 'businesses') {
    if (count === 0) return 'Be Our First Partner';
    if (count === 1) return 'Founding Business';
    if (count <= 10) return 'Founding Businesses';
    if (count <= 50) return 'Businesses & Growing';
    return 'Black-Owned Businesses';
  }
  if (type === 'members') {
    if (count === 0) return 'Join as a Founder';
    if (count === 1) return 'Founding Member';
    if (count <= 50) return 'Founding Members';
    if (count <= 500) return 'Members & Growing';
    return 'Community Members';
  }
  if (type === 'transactions') {
    if (count === 0) return 'Make History';
    if (count <= 10) return 'Transactions & Counting';
    if (count <= 100) return 'Transactions Made';
    return 'Transactions';
  }
  if (type === 'value') {
    if (count === 0) return 'Start the Movement';
    if (count < 1000) return 'Circulated So Far';
    if (count < 10000) return 'Economic Impact';
    return 'Economic Impact';
  }
  return '';
};

export const ImpactCounter: React.FC = () => {
  const [stats, setStats] = useState<ImpactStats>({
    totalBusinesses: 0,
    totalTransactions: 0,
    totalValue: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpactStats = async () => {
      try {
        // Use RPC function to bypass RLS and get accurate counts
        const { data, error } = await supabase.rpc('get_platform_stats');
        
        if (error) {
          console.error('Error fetching platform stats:', error);
          return;
        }

        if (data) {
          setStats({
            totalBusinesses: data.total_businesses || 0,
            totalTransactions: data.total_transactions || 0,
            totalValue: data.total_value || 0,
            totalCustomers: data.total_members || 0
          });
        }
      } catch (error) {
        console.error('Error fetching impact stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactStats();
  }, []);

  const impactMetrics = [
    { 
      icon: Building2, 
      value: stats.totalBusinesses,
      suffix: stats.totalBusinesses > 50 ? '+' : '',
      label: getHonestLabel('businesses', stats.totalBusinesses),
      gradient: 'from-emerald-400 to-teal-500'
    },
    { 
      icon: Users, 
      value: stats.totalCustomers,
      suffix: stats.totalCustomers > 500 ? '+' : '',
      label: getHonestLabel('members', stats.totalCustomers),
      gradient: 'from-blue-400 to-indigo-500'
    },
    { 
      icon: TrendingUp, 
      value: stats.totalTransactions,
      suffix: stats.totalTransactions > 100 ? '+' : '',
      label: getHonestLabel('transactions', stats.totalTransactions),
      gradient: 'from-purple-400 to-pink-500'
    },
    { 
      icon: DollarSign, 
      value: stats.totalValue,
      prefix: '$',
      label: getHonestLabel('value', stats.totalValue),
      gradient: 'from-amber-400 to-orange-500'
    },
  ];

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mansagold/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Early Access Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mansagold/20 border border-mansagold/30 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4 text-mansagold" />
            <span className="text-mansagold text-sm font-medium">Live Data • Early Access</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-4">
            <span className="text-white">Together We're </span>
            <span className="text-gradient-gold">Building Wealth</span>
          </h2>
          <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
            Join our growing community. Every transaction strengthens Black economic power.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 text-center group-hover:border-white/20 group-hover:bg-slate-800/60 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${metric.gradient} mb-4`}>
                  <metric.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 font-playfair">
                  {loading ? (
                    <span className="animate-pulse">--</span>
                  ) : metric.value === 0 ? (
                    <span className="text-xl md:text-2xl">--</span>
                  ) : (
                    <AnimatedCounter 
                      target={metric.value} 
                      prefix={metric.prefix || ''} 
                      suffix={metric.suffix || ''} 
                    />
                  )}
                </div>
                <p className="text-blue-200/70 text-xs md:text-sm font-medium">{metric.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
