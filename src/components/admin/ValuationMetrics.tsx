import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Building2, DollarSign, Target, Gem, BarChart3, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SUBSCRIPTION_PRICE_MONTHLY = 39; // $39/mo Directory Starter
const PLATFORM_COMMISSION_RATE = 0.075; // 7.5%
const AVG_BOOKING_VALUE = 150; // average transaction value
const INFRASTRUCTURE_MULTIPLIER_LOW = 18;
const INFRASTRUCTURE_MULTIPLIER_HIGH = 25;

const ValuationMetrics: React.FC = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['valuation-metrics'],
    queryFn: async () => {
      const [usersRes, businessesRes, verifiedRes, referralsRes, agentsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('businesses').select('id', { count: 'exact', head: true }),
        supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.from('referrals').select('id', { count: 'exact', head: true }),
        supabase.from('sales_agents').select('id', { count: 'exact', head: true }),
      ]);

      return {
        totalUsers: usersRes.count || 0,
        totalBusinesses: businessesRes.count || 0,
        verifiedBusinesses: verifiedRes.count || 0,
        totalReferrals: referralsRes.count || 0,
        totalAgents: agentsRes.count || 0,
      };
    },
  });

  const totalUsers = metrics?.totalUsers || 0;
  const totalBusinesses = metrics?.totalBusinesses || 0;
  const verifiedBusinesses = metrics?.verifiedBusinesses || 0;
  const totalAgents = metrics?.totalAgents || 0;

  // ARR Projections
  const currentSubscriptionARR = verifiedBusinesses * SUBSCRIPTION_PRICE_MONTHLY * 12;
  const projectedARR_1k = 1000 * SUBSCRIPTION_PRICE_MONTHLY * 12;
  const projectedARR_10k = 10000 * SUBSCRIPTION_PRICE_MONTHLY * 12;
  const projectedARR_100k = 100000 * SUBSCRIPTION_PRICE_MONTHLY * 12;

  // Commission revenue (estimated)
  const monthlyTransactions = totalUsers * 2; // conservative: 2 transactions/user/month
  const commissionARR = monthlyTransactions * AVG_BOOKING_VALUE * PLATFORM_COMMISSION_RATE * 12;

  const totalCurrentARR = currentSubscriptionARR + commissionARR;

  // Valuation ranges
  const valuationLow = totalCurrentARR * INFRASTRUCTURE_MULTIPLIER_LOW;
  const valuationHigh = totalCurrentARR * INFRASTRUCTURE_MULTIPLIER_HIGH;

  // Growth milestones
  const milestones = [
    { name: 'Current', businesses: totalBusinesses, users: totalUsers, arr: totalCurrentARR },
    { name: '1K Biz', businesses: 1000, users: 5000, arr: projectedARR_1k + (5000 * 2 * AVG_BOOKING_VALUE * PLATFORM_COMMISSION_RATE * 12) },
    { name: '10K Biz', businesses: 10000, users: 50000, arr: projectedARR_10k + (50000 * 2 * AVG_BOOKING_VALUE * PLATFORM_COMMISSION_RATE * 12) },
    { name: '100K Biz', businesses: 100000, users: 500000, arr: projectedARR_100k + (500000 * 2 * AVG_BOOKING_VALUE * PLATFORM_COMMISSION_RATE * 12) },
  ];

  const valuationMilestones = milestones.map(m => ({
    ...m,
    valuationLow: m.arr * INFRASTRUCTURE_MULTIPLIER_LOW,
    valuationHigh: m.arr * INFRASTRUCTURE_MULTIPLIER_HIGH,
  }));

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
  };

  // Progress toward 100K businesses target
  const progressPercent = Math.min((totalBusinesses / 100000) * 100, 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-mansagold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Gem className="h-6 w-6 text-mansagold" />
          Valuation Metrics
        </h2>
        <p className="text-sm opacity-70 mt-1">
          Real-time KPIs driving toward $1.48B target valuation (18-25x ARR infrastructure multiple)
        </p>
      </div>

      {/* Current Traction Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium opacity-60 uppercase tracking-wider">Users</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(totalUsers)}</p>
            <p className="text-xs opacity-50 mt-1">of 500K target</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium opacity-60 uppercase tracking-wider">Businesses</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(totalBusinesses)}</p>
            <p className="text-xs opacity-50 mt-1">{verifiedBusinesses} verified</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-mansagold" />
              <span className="text-xs font-medium opacity-60 uppercase tracking-wider">Current ARR</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalCurrentARR)}</p>
            <p className="text-xs opacity-50 mt-1">subs + commission</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-5 pb-4 px-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-medium opacity-60 uppercase tracking-wider">Agents</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(totalAgents)}</p>
            <p className="text-xs opacity-50 mt-1">sales ambassadors</p>
          </CardContent>
        </Card>
      </div>

      {/* Valuation Estimate */}
      <Card className="bg-gradient-to-r from-mansagold/10 to-amber-500/5 border-mansagold/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-mansagold" />
            Current Implied Valuation
          </CardTitle>
          <CardDescription>Based on {INFRASTRUCTURE_MULTIPLIER_LOW}-{INFRASTRUCTURE_MULTIPLIER_HIGH}x ARR infrastructure multiple</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-xs opacity-60 uppercase tracking-wider mb-1">Conservative (18x)</p>
              <p className="text-3xl font-bold text-mansagold">{formatCurrency(valuationLow)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-60 uppercase tracking-wider mb-1">Mid-Range (21.5x)</p>
              <p className="text-3xl font-bold text-mansagold">{formatCurrency((valuationLow + valuationHigh) / 2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-60 uppercase tracking-wider mb-1">Aggressive (25x)</p>
              <p className="text-3xl font-bold text-mansagold">{formatCurrency(valuationHigh)}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs opacity-60 mb-2">
              <span>Progress to 100K businesses</span>
              <span>{progressPercent.toFixed(3)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-mansagold to-amber-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(progressPercent, 0.5)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-mansagold" />
              Revenue Streams (Current)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="opacity-70">Directory Subscriptions</span>
                  <span className="font-medium">{formatCurrency(currentSubscriptionARR)}/yr</span>
                </div>
                <p className="text-xs opacity-40">{verifiedBusinesses} businesses × ${SUBSCRIPTION_PRICE_MONTHLY}/mo × 12</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="opacity-70">Platform Commission (7.5%)</span>
                  <span className="font-medium">{formatCurrency(commissionARR)}/yr</span>
                </div>
                <p className="text-xs opacity-40">{totalUsers} users × 2 txns/mo × ${AVG_BOOKING_VALUE} avg × 7.5%</p>
              </div>
              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between text-sm font-bold">
                  <span>Total Current ARR</span>
                  <span className="text-mansagold">{formatCurrency(totalCurrentARR)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-mansagold" />
              Valuation at Scale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={valuationMilestones}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)" 
                  fontSize={11}
                  tickFormatter={(v) => {
                    if (v >= 1e9) return `$${(v/1e9).toFixed(0)}B`;
                    if (v >= 1e6) return `$${(v/1e6).toFixed(0)}M`;
                    if (v >= 1e3) return `$${(v/1e3).toFixed(0)}K`;
                    return `$${v}`;
                  }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Bar dataKey="valuationLow" fill="rgba(202, 163, 74, 0.4)" name="18x ARR" radius={[4, 4, 0, 0]} />
                <Bar dataKey="valuationHigh" fill="rgba(202, 163, 74, 0.8)" name="25x ARR" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Milestone Targets Table */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Growth Milestones → Target Valuation</CardTitle>
          <CardDescription>Based on patent-protected infrastructure (27 claims, USPTO 63/969,202)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 pr-4 font-medium opacity-70">Milestone</th>
                  <th className="text-right py-2 px-4 font-medium opacity-70">Businesses</th>
                  <th className="text-right py-2 px-4 font-medium opacity-70">Users</th>
                  <th className="text-right py-2 px-4 font-medium opacity-70">Projected ARR</th>
                  <th className="text-right py-2 px-4 font-medium opacity-70">Valuation (18x)</th>
                  <th className="text-right py-2 pl-4 font-medium opacity-70">Valuation (25x)</th>
                </tr>
              </thead>
              <tbody>
                {valuationMilestones.map((m, i) => (
                  <tr key={m.name} className={`border-b border-white/5 ${i === 0 ? 'bg-mansagold/5' : ''}`}>
                    <td className="py-2.5 pr-4 font-medium">
                      {i === 0 && <span className="inline-block w-2 h-2 bg-mansagold rounded-full mr-2" />}
                      {m.name}
                    </td>
                    <td className="text-right py-2.5 px-4">{formatNumber(m.businesses)}</td>
                    <td className="text-right py-2.5 px-4">{formatNumber(m.users)}</td>
                    <td className="text-right py-2.5 px-4 text-mansagold font-medium">{formatCurrency(m.arr)}</td>
                    <td className="text-right py-2.5 px-4">{formatCurrency(m.valuationLow)}</td>
                    <td className="text-right py-2.5 pl-4 font-medium">{formatCurrency(m.valuationHigh)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Moat Summary */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Competitive Moat & Multiplier Justification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Patent Protection', desc: '27-claim USPTO Patent 63/969,202 covering CMAL, Susu, Voice AI, Fraud Detection', icon: '🛡️' },
              { title: 'Data Moat', desc: 'Non-portable reputation, financial history, B2B relationships create high switching costs', icon: '🔒' },
              { title: 'PaaS Infrastructure', desc: '"Stripe for circular economies" — licensable APIs justify infrastructure-grade multiples', icon: '⚡' },
              { title: 'Network Effects', desc: '2.3x CMAL multiplier + Karma decay create compounding community value', icon: '🌐' },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                <p className="text-xs opacity-50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValuationMetrics;
