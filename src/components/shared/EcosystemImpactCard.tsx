import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Code, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEcosystemStats } from '@/hooks/use-technical-partner';

interface EcosystemImpactCardProps {
  variant?: 'compact' | 'full';
  showTitle?: boolean;
}

const EcosystemImpactCard: React.FC<EcosystemImpactCardProps> = ({ 
  variant = 'compact',
  showTitle = true 
}) => {
  const { stats, loading } = useEcosystemStats();

  if (loading) {
    return (
      <Card className="glass-card border-white/10 animate-pulse">
        <CardContent className="py-8">
          <div className="h-20 bg-white/5 rounded" />
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      label: 'Partner Networks',
      value: stats?.active_partners || 0,
      icon: Users,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
    },
    {
      label: 'Businesses Referred',
      value: stats?.partner_referred_businesses || 0,
      icon: Building2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
    },
    {
      label: 'Active Developers',
      value: stats?.active_developers || 0,
      icon: Code,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      label: 'Technical Partners',
      value: stats?.technical_partners || 0,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
  ];

  if (variant === 'compact') {
    return (
      <Card className="glass-card border-white/10">
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {metrics.slice(0, 3).map((metric, index) => (
              <div key={metric.label} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{metric.value.toLocaleString()}</p>
                  <p className="text-xs text-white/50">{metric.label}</p>
                </div>
                {index < 2 && (
                  <ArrowRight className="h-4 w-4 text-white/20 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-white/10 overflow-hidden">
      {showTitle && (
        <CardHeader className="border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-mansagold" />
                Ecosystem Impact
              </CardTitle>
              <CardDescription className="text-white/60">
                Real-time cross-pollination metrics
              </CardDescription>
            </div>
            <Badge className="bg-mansagold/20 text-mansagold border-mansagold/50">
              Live
            </Badge>
          </div>
        </CardHeader>
      )}
      <CardContent className="pt-6">
        {/* Virtuous Cycle Visualization */}
        <div className="relative mb-6">
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/40 rounded-xl p-4 border border-white/5"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{metric.value.toLocaleString()}</p>
                    <p className="text-sm text-white/50">{metric.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Connection lines (decorative) */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(245, 158, 11, 0.2)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Combined Earnings */}
        <div className="bg-gradient-to-r from-mansagold/10 to-mansablue/10 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Combined Ecosystem Revenue</p>
              <p className="text-2xl font-bold text-white">
                ${((stats?.total_partner_earnings || 0) + (stats?.total_technical_partner_earnings || 0)).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">Partner Earnings</p>
              <p className="text-sm font-semibold text-amber-400">
                ${(stats?.total_partner_earnings || 0).toLocaleString()}
              </p>
              <p className="text-xs text-white/40 mt-1">Developer Earnings</p>
              <p className="text-sm font-semibold text-blue-400">
                ${(stats?.total_technical_partner_earnings || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Flow Description */}
        <p className="text-xs text-white/40 text-center mt-4">
          Partners → Businesses → API Data → Developer Apps → More Value → More Referrals
        </p>
      </CardContent>
    </Card>
  );
};

export default EcosystemImpactCard;
