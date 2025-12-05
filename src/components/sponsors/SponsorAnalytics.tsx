import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MousePointerClick, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface SponsorAnalyticsProps {
  subscriptionId: string;
}

export const SponsorAnalytics = ({ subscriptionId }: SponsorAnalyticsProps) => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['sponsor-analytics', subscriptionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_impact_metrics')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('metric_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-white/10 animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-white/10 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalImpressions = metrics?.reduce((sum, m) => sum + (m.impressions || 0), 0) || 0;
  const totalClicks = metrics?.reduce((sum, m) => sum + (m.clicks || 0), 0) || 0;
  const clickThroughRate = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';
  const avgDailyImpressions = metrics && metrics.length > 0 ? Math.round(totalImpressions / metrics.length) : 0;

  // Prepare chart data
  const chartData = metrics
    ?.slice(0, 14)
    .reverse()
    .map((m) => ({
      date: format(new Date(m.metric_date), 'MMM d'),
      impressions: m.impressions || 0,
      clicks: m.clicks || 0,
    })) || [];

  const statCards = [
    {
      title: 'Total Impressions',
      value: totalImpressions.toLocaleString(),
      description: 'All-time views of your sponsor logo',
      icon: Eye,
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      description: 'Clicks to your website',
      icon: MousePointerClick,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Click-Through Rate',
      value: `${clickThroughRate}%`,
      description: 'Engagement rate',
      icon: TrendingUp,
      gradient: 'from-amber-500 to-yellow-600',
    },
    {
      title: 'Avg Daily Impressions',
      value: avgDailyImpressions.toLocaleString(),
      description: 'Last 30 days',
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden relative group hover:bg-white/10 transition-colors h-full">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`} />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-blue-200/70">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} flex-shrink-0`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative pt-0">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-blue-200/50 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-amber-100">Performance Over Time</CardTitle>
          <CardDescription className="text-blue-200/70">Last 14 days of impressions and clicks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(191,219,254,0.5)" fontSize={12} />
              <YAxis stroke="rgba(191,219,254,0.5)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(10, 22, 40, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line type="monotone" dataKey="impressions" stroke="#fbbf24" strokeWidth={2} name="Impressions" dot={{ fill: '#fbbf24' }} />
              <Line type="monotone" dataKey="clicks" stroke="#60a5fa" strokeWidth={2} name="Clicks" dot={{ fill: '#60a5fa' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};