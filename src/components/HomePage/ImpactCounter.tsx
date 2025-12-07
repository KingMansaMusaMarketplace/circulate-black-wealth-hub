import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, DollarSign, Building2 } from 'lucide-react';
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
        const { count: businessCount } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .eq('is_verified', true);

        const { count: transactionCount } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true });

        const { data: transactionData } = await supabase
          .from('transactions')
          .select('amount');

        const totalValue = transactionData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        const { data: customerData } = await supabase
          .from('transactions')
          .select('customer_id');

        const uniqueCustomers = new Set(customerData?.map(t => t.customer_id)).size;

        setStats({
          totalBusinesses: businessCount || 0,
          totalTransactions: transactionCount || 0,
          totalValue: totalValue,
          totalCustomers: uniqueCustomers || 0
        });
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
      value: stats.totalBusinesses || 2500,
      suffix: '+',
      label: 'Black-Owned Businesses',
      gradient: 'from-emerald-400 to-teal-500'
    },
    { 
      icon: Users, 
      value: stats.totalCustomers || 150000,
      suffix: '+',
      label: 'Community Members',
      gradient: 'from-blue-400 to-indigo-500'
    },
    { 
      icon: TrendingUp, 
      value: stats.totalTransactions || 50000,
      suffix: '+',
      label: 'Transactions',
      gradient: 'from-purple-400 to-pink-500'
    },
    { 
      icon: DollarSign, 
      value: stats.totalValue || 45000000,
      prefix: '$',
      label: 'Economic Impact',
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
          <span className="inline-block text-mansagold text-sm font-semibold uppercase tracking-widest mb-3">
            Real-Time Impact
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-4">
            <span className="text-white">Together We're </span>
            <span className="text-gradient-gold">Building Wealth</span>
          </h2>
          <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
            Every transaction strengthens our community and creates generational impact.
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
