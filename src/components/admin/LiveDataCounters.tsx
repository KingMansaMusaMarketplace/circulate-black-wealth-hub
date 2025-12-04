import React, { useState, useEffect } from 'react';
import { Users, Building2, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Counter {
  label: string;
  value: number;
  previousValue: number;
  icon: React.ElementType;
  color: string;
  prefix?: string;
}

const LiveDataCounters: React.FC = () => {
  const [counters, setCounters] = useState<Counter[]>([
    { label: 'Users', value: 0, previousValue: 0, icon: Users, color: 'text-blue-400' },
    { label: 'Businesses', value: 0, previousValue: 0, icon: Building2, color: 'text-green-400' },
    { label: 'Revenue', value: 0, previousValue: 0, icon: DollarSign, color: 'text-yellow-400', prefix: '$' },
    { label: 'Growth', value: 0, previousValue: 0, icon: TrendingUp, color: 'text-purple-400', prefix: '' },
  ]);
  const [isAnimating, setIsAnimating] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscriptions
    const usersChannel = supabase
      .channel('live-users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchData();
        animateCounter(0);
      })
      .subscribe();

    const businessesChannel = supabase
      .channel('live-businesses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, () => {
        fetchData();
        animateCounter(1);
      })
      .subscribe();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => {
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(businessesChannel);
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    const [usersRes, businessesRes, transactionsRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('businesses').select('id', { count: 'exact', head: true }),
      supabase.from('transactions').select('amount').limit(1000),
    ]);

    const totalRevenue = transactionsRes.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
    const usersCount = usersRes.count || 0;
    const businessesCount = businessesRes.count || 0;

    // Calculate growth (mock: businesses/users ratio as percentage)
    const growthRate = usersCount > 0 ? Math.round((businessesCount / usersCount) * 100) : 0;

    setCounters(prev => [
      { ...prev[0], previousValue: prev[0].value, value: usersCount },
      { ...prev[1], previousValue: prev[1].value, value: businessesCount },
      { ...prev[2], previousValue: prev[2].value, value: totalRevenue },
      { ...prev[3], previousValue: prev[3].value, value: growthRate },
    ]);
  };

  const animateCounter = (index: number) => {
    setIsAnimating(index);
    setTimeout(() => setIsAnimating(null), 1000);
  };

  const formatValue = (value: number, prefix?: string) => {
    if (prefix === '$') {
      return `$${value.toLocaleString()}`;
    }
    if (prefix === '') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  const getChangeIndicator = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowUpRight className="h-3 w-3 text-green-400" />;
    } else if (current < previous) {
      return <ArrowDownRight className="h-3 w-3 text-red-400" />;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-4">
      {counters.map((counter, index) => (
        <div
          key={counter.label}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 ${
            isAnimating === index ? 'scale-105 bg-white/10 border-yellow-500/50' : ''
          }`}
        >
          <counter.icon className={`h-4 w-4 ${counter.color}`} />
          <div className="flex flex-col">
            <span className="text-[10px] text-blue-200/60 leading-none">{counter.label}</span>
            <div className="flex items-center gap-1">
              <span className={`text-sm font-bold text-white leading-none ${
                isAnimating === index ? 'animate-pulse' : ''
              }`}>
                {formatValue(counter.value, counter.prefix)}
              </span>
              {getChangeIndicator(counter.value, counter.previousValue)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveDataCounters;
