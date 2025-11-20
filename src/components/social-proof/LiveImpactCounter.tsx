import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Building2, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LiveImpactCounterProps {
  totalUsers: number;
  totalBusinesses: number;
  wealthCirculated: number;
  jobsSupported: number;
  activeThisWeek: number;
}

const LiveImpactCounter: React.FC<LiveImpactCounterProps> = ({
  totalUsers,
  totalBusinesses,
  wealthCirculated,
  jobsSupported,
  activeThisWeek
}) => {
  const [counts, setCounts] = useState({
    users: 0,
    businesses: 0,
    wealth: 0,
    jobs: 0
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        users: Math.floor(totalUsers * progress),
        businesses: Math.floor(totalBusinesses * progress),
        wealth: Math.floor(wealthCirculated * progress),
        jobs: Math.floor(jobsSupported * progress)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [totalUsers, totalBusinesses, wealthCirculated, jobsSupported]);

  const stats = [
    {
      icon: Users,
      label: 'Active Members',
      value: counts.users.toLocaleString(),
      subtext: `${activeThisWeek.toLocaleString()} active this week`,
      color: 'text-primary'
    },
    {
      icon: Building2,
      label: 'Black-Owned Businesses',
      value: counts.businesses.toLocaleString(),
      subtext: 'Verified & thriving',
      color: 'text-secondary'
    },
    {
      icon: TrendingUp,
      label: 'Wealth Circulated',
      value: `$${(counts.wealth / 1000).toFixed(1)}K`,
      subtext: 'In the last 30 days',
      color: 'text-accent'
    },
    {
      icon: Briefcase,
      label: 'Jobs Supported',
      value: counts.jobs.toLocaleString(),
      subtext: 'Full-time equivalents',
      color: 'text-primary'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <stat.icon className="w-8 h-8 text-blue-400" />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm font-medium text-white/90">{stat.label}</p>
                <p className="text-xs text-white/60">{stat.subtext}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default LiveImpactCounter;
