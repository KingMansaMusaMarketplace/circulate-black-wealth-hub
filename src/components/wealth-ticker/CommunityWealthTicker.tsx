import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Building2, Users, DollarSign, Sparkles } from 'lucide-react';
import { useWealthMetrics } from './useWealthMetrics';
import { useCountUp } from '@/hooks/useCountUp';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  gradient: string;
}

const StatCard = ({ icon, label, value, prefix = '', suffix = '', delay = 0, gradient }: StatCardProps) => {
  const { count, ref } = useCountUp({ end: value, duration: 2500 });
  
  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-mansagold/30 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
        {/* Glow effect on hover */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradient} blur-xl`} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2.5 rounded-xl ${gradient}`}>
              {icon}
            </div>
            <span className="text-blue-200/80 text-sm font-medium">{label}</span>
          </div>
          
          <div className="text-3xl md:text-4xl font-bold text-white font-playfair">
            {prefix}{count.toLocaleString()}{suffix}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface CommunityWealthTickerProps {
  variant?: 'full' | 'compact';
  className?: string;
}

const CommunityWealthTicker = ({ variant = 'full', className = '' }: CommunityWealthTickerProps) => {
  const { metrics, loading } = useWealthMetrics();

  if (loading || !metrics) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div 
        className={`relative overflow-hidden rounded-2xl ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-mansablue-dark/90 via-mansablue/90 to-mansablue-dark/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-mansagold/20">
                <TrendingUp className="w-5 h-5 text-mansagold" />
              </div>
              <div>
                <p className="text-blue-200/70 text-xs font-medium uppercase tracking-wider">Community Impact</p>
                <p className="text-2xl font-bold text-white font-playfair">
                  ${metrics.economic_impact.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-mansagold" />
                <span className="text-white font-semibold">{metrics.businesses_supported}</span>
                <span className="text-blue-200/70">Businesses</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-mansagold" />
                <span className="text-white font-semibold">{metrics.sponsor_count}</span>
                <span className="text-blue-200/70">Sponsors</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <section className={`relative py-12 ${className}`}>
      {/* Section header */}
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/10 border border-mansagold/30 mb-4">
          <Sparkles className="w-4 h-4 text-mansagold" />
          <span className="text-sm font-semibold text-mansagold tracking-wide uppercase">
            Live Community Impact
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">
          <span className="text-white">The </span>
          <span className="text-gradient-gold">Wealth Multiplier</span>
        </h2>
        <p className="text-blue-200/80 max-w-2xl mx-auto">
          Every dollar spent at a Black-owned business creates <span className="text-mansagold font-semibold">{metrics.multiplier}x</span> the economic impact in our community.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
        <StatCard
          icon={<DollarSign className="w-5 h-5 text-white" />}
          label="Total Circulated"
          value={metrics.total_spent}
          prefix="$"
          delay={0}
          gradient="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20"
        />
        
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          label="Economic Impact"
          value={metrics.economic_impact}
          prefix="$"
          delay={0.1}
          gradient="bg-gradient-to-br from-mansagold/20 to-amber-600/20"
        />
        
        <StatCard
          icon={<Building2 className="w-5 h-5 text-white" />}
          label="Businesses Supported"
          value={metrics.businesses_supported}
          delay={0.2}
          gradient="bg-gradient-to-br from-blue-500/20 to-blue-600/20"
        />
        
        <StatCard
          icon={<Users className="w-5 h-5 text-white" />}
          label="Corporate Sponsors"
          value={metrics.sponsor_count}
          delay={0.3}
          gradient="bg-gradient-to-br from-purple-500/20 to-purple-600/20"
        />
      </div>

      {/* Sponsor investment callout */}
      {metrics.sponsor_investment > 0 && (
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-mansagold/10 via-mansagold/20 to-mansagold/10 border border-mansagold/30">
            <Sparkles className="w-5 h-5 text-mansagold" />
            <span className="text-white font-medium">
              <span className="text-mansagold font-bold">${metrics.sponsor_investment.toLocaleString()}</span>
              {' '}invested monthly by corporate sponsors
            </span>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default CommunityWealthTicker;
