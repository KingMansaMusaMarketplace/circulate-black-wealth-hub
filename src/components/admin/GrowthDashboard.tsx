import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Users, Building2, Handshake, DollarSign, 
  ArrowUpRight, ArrowDownRight, Activity, RefreshCw,
  Target, Zap, Clock, Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface GrowthMetrics {
  totalUsers: number;
  totalBusinesses: number;
  totalPartners: number;
  activePartners: number;
  totalReferrals: number;
  convertedReferrals: number;
  pendingPayouts: number;
  totalEarnings: number;
  thisWeekSignups: number;
  lastWeekSignups: number;
  thisWeekBusinesses: number;
  lastWeekBusinesses: number;
}

interface DailyData {
  date: string;
  users: number;
  businesses: number;
  referrals: number;
}

const GrowthDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<GrowthMetrics | null>(null);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch business count
      const { count: businessCount } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true });

      // Fetch partner stats
      const { data: partners } = await supabase
        .from('directory_partners')
        .select('id, status, pending_earnings, total_earnings');

      const activePartners = partners?.filter(p => p.status === 'active').length || 0;
      const pendingPayouts = partners?.reduce((sum, p) => sum + (p.pending_earnings || 0), 0) || 0;
      const totalEarnings = partners?.reduce((sum, p) => sum + (p.total_earnings || 0), 0) || 0;

      // Fetch referral stats
      const { data: referrals } = await supabase
        .from('partner_referrals')
        .select('id, is_converted');

      const convertedReferrals = referrals?.filter(r => r.is_converted).length || 0;

      // Fetch this week vs last week signups
      const now = new Date();
      const thisWeekStart = startOfDay(subDays(now, 7));
      const lastWeekStart = startOfDay(subDays(now, 14));
      const lastWeekEnd = endOfDay(subDays(now, 7));

      const { count: thisWeekUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisWeekStart.toISOString());

      const { count: lastWeekUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastWeekStart.toISOString())
        .lt('created_at', lastWeekEnd.toISOString());

      const { count: thisWeekBiz } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisWeekStart.toISOString());

      const { count: lastWeekBiz } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastWeekStart.toISOString())
        .lt('created_at', lastWeekEnd.toISOString());

      setMetrics({
        totalUsers: userCount || 0,
        totalBusinesses: businessCount || 0,
        totalPartners: partners?.length || 0,
        activePartners,
        totalReferrals: referrals?.length || 0,
        convertedReferrals,
        pendingPayouts,
        totalEarnings,
        thisWeekSignups: thisWeekUsers || 0,
        lastWeekSignups: lastWeekUsers || 0,
        thisWeekBusinesses: thisWeekBiz || 0,
        lastWeekBusinesses: lastWeekBiz || 0,
      });

      // Fetch daily data for chart (last 14 days)
      const dailyStats: DailyData[] = [];
      for (let i = 13; i >= 0; i--) {
        const dayStart = startOfDay(subDays(now, i));
        const dayEnd = endOfDay(subDays(now, i));

        const { count: dayUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dayStart.toISOString())
          .lt('created_at', dayEnd.toISOString());

        const { count: dayBiz } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dayStart.toISOString())
          .lt('created_at', dayEnd.toISOString());

        const { count: dayRefs } = await supabase
          .from('partner_referrals')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dayStart.toISOString())
          .lt('created_at', dayEnd.toISOString());

        dailyStats.push({
          date: format(dayStart, 'MMM d'),
          users: dayUsers || 0,
          businesses: dayBiz || 0,
          referrals: dayRefs || 0,
        });
      }

      setDailyData(dailyStats);
    } catch (error) {
      console.error('Error fetching growth metrics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  const getGrowthPercent = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendLabel,
    color = 'text-blue-400'
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    trend?: number;
    trendLabel?: string;
    color?: string;
  }) => (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${
                trend >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {trend >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{Math.abs(trend)}%</span>
                {trendLabel && <span className="text-slate-500">{trendLabel}</span>}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-slate-900/60 ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-mansagold" />
      </div>
    );
  }

  const userGrowth = getGrowthPercent(metrics?.thisWeekSignups || 0, metrics?.lastWeekSignups || 0);
  const bizGrowth = getGrowthPercent(metrics?.thisWeekBusinesses || 0, metrics?.lastWeekBusinesses || 0);
  const conversionRate = metrics?.totalReferrals 
    ? Math.round((metrics.convertedReferrals / metrics.totalReferrals) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-mansagold" />
            Growth Dashboard
          </h2>
          <p className="text-slate-400">Real-time platform performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers.toLocaleString() || '0'}
          icon={Users}
          trend={userGrowth}
          trendLabel="vs last week"
          color="text-blue-400"
        />
        <MetricCard
          title="Total Businesses"
          value={metrics?.totalBusinesses.toLocaleString() || '0'}
          icon={Building2}
          trend={bizGrowth}
          trendLabel="vs last week"
          color="text-emerald-400"
        />
        <MetricCard
          title="Active Partners"
          value={`${metrics?.activePartners || 0} / ${metrics?.totalPartners || 0}`}
          icon={Handshake}
          color="text-amber-400"
        />
        <MetricCard
          title="Partner Earnings"
          value={`$${(metrics?.totalEarnings || 0).toLocaleString()}`}
          icon={DollarSign}
          color="text-purple-400"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Signups Chart */}
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-mansagold" />
              Daily Signups (14 Days)
            </CardTitle>
            <CardDescription className="text-slate-400">
              New users and businesses per day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Users" dot={false} />
                <Line type="monotone" dataKey="businesses" stroke="#10b981" strokeWidth={2} name="Businesses" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Partner Referrals Chart */}
        <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Handshake className="h-5 w-5 text-mansagold" />
              Partner Referrals
            </CardTitle>
            <CardDescription className="text-slate-400">
              Daily referrals from partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="referrals" fill="#f59e0b" name="Referrals" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activation Metrics */}
      <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-mansagold" />
            Activation & Conversion
          </CardTitle>
          <CardDescription className="text-slate-400">
            Key performance indicators for growth velocity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-900/40 rounded-xl border border-slate-700/30">
              <p className="text-3xl font-bold text-blue-400">{metrics?.thisWeekSignups || 0}</p>
              <p className="text-sm text-slate-400 mt-1">This Week's Users</p>
              <p className="text-xs text-slate-500 mt-1">
                Target: 50/week for growth
              </p>
            </div>
            <div className="text-center p-4 bg-slate-900/40 rounded-xl border border-slate-700/30">
              <p className="text-3xl font-bold text-emerald-400">{metrics?.thisWeekBusinesses || 0}</p>
              <p className="text-sm text-slate-400 mt-1">This Week's Businesses</p>
              <p className="text-xs text-slate-500 mt-1">
                Target: 10/week for traction
              </p>
            </div>
            <div className="text-center p-4 bg-slate-900/40 rounded-xl border border-slate-700/30">
              <p className="text-3xl font-bold text-amber-400">{conversionRate}%</p>
              <p className="text-sm text-slate-400 mt-1">Partner Conversion Rate</p>
              <p className="text-xs text-slate-500 mt-1">
                {metrics?.convertedReferrals} / {metrics?.totalReferrals} referrals
              </p>
            </div>
            <div className="text-center p-4 bg-slate-900/40 rounded-xl border border-slate-700/30">
              <p className="text-3xl font-bold text-purple-400">${metrics?.pendingPayouts.toLocaleString()}</p>
              <p className="text-sm text-slate-400 mt-1">Pending Payouts</p>
              <p className="text-xs text-slate-500 mt-1">
                Owed to partners
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Path to $1B */}
      <Card className="bg-gradient-to-br from-mansagold/20 to-amber-900/20 backdrop-blur-xl border-mansagold/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-mansagold" />
            Path to $1B (2030)
          </CardTitle>
          <CardDescription className="text-amber-200/70">
            Progress toward 100,000 businesses @ $100/month = $120M ARR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">Business Progress</span>
                <span className="text-sm text-mansagold">
                  {metrics?.totalBusinesses.toLocaleString()} / 100,000
                </span>
              </div>
              <div className="h-4 bg-slate-900/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-mansagold to-amber-500 transition-all duration-500"
                  style={{ width: `${Math.min(((metrics?.totalBusinesses || 0) / 100000) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {(100000 - (metrics?.totalBusinesses || 0)).toLocaleString()} businesses to go • 
                Need ~2,000/month by 2027 to hit target
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthDashboard;
