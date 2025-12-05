import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, UserMinus, UserCheck, Activity } from 'lucide-react';
import { format, subDays, subMonths, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const RetentionAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6m');

  const { data: userStats } = useQuery({
    queryKey: ['retention-user-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, created_at, updated_at, role');
      if (error) throw error;
      return data;
    }
  });

  const { data: activityData } = useQuery({
    queryKey: ['retention-activity'],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const { data, error } = await supabase
        .from('activity_log')
        .select('user_id, created_at')
        .gte('created_at', thirtyDaysAgo);
      if (error) throw error;
      return data;
    }
  });

  // Calculate retention metrics
  const calculateMetrics = () => {
    if (!userStats) return null;

    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    // Active users (activity in last 30 days)
    const activeUserIds = new Set(activityData?.map(a => a.user_id) || []);
    const activeUsers = activeUserIds.size;

    // Total users
    const totalUsers = userStats.length;

    // New users this month
    const newUsersThisMonth = userStats.filter(u => 
      new Date(u.created_at) >= startOfMonth(now)
    ).length;

    // Users who signed up 30-60 days ago
    const cohort30to60 = userStats.filter(u => {
      const created = new Date(u.created_at);
      return created >= sixtyDaysAgo && created < thirtyDaysAgo;
    });

    // Of those, how many are still active?
    const retainedFromCohort = cohort30to60.filter(u => activeUserIds.has(u.id)).length;
    const retentionRate = cohort30to60.length > 0 
      ? ((retainedFromCohort / cohort30to60.length) * 100).toFixed(1)
      : '0';

    // Churn rate (users inactive for 30+ days)
    const inactiveUsers = totalUsers - activeUsers;
    const churnRate = totalUsers > 0 
      ? ((inactiveUsers / totalUsers) * 100).toFixed(1)
      : '0';

    return {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      retentionRate: parseFloat(retentionRate),
      churnRate: parseFloat(churnRate),
      inactiveUsers
    };
  };

  // Generate cohort data for chart
  const generateCohortData = () => {
    if (!userStats) return [];

    const months = timeRange === '6m' ? 6 : timeRange === '3m' ? 3 : 12;
    const data = [];

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(subMonths(new Date(), i));
      
      const usersInMonth = userStats.filter(u => {
        const created = new Date(u.created_at);
        return created >= monthStart && created <= monthEnd;
      });

      const activeFromCohort = usersInMonth.filter(u => {
        const lastActivity = activityData?.find(a => a.user_id === u.id);
        return lastActivity && differenceInDays(new Date(), new Date(lastActivity.created_at)) <= 30;
      });

      data.push({
        month: format(monthStart, 'MMM'),
        signups: usersInMonth.length,
        retained: activeFromCohort.length,
        retention: usersInMonth.length > 0 
          ? Math.round((activeFromCohort.length / usersInMonth.length) * 100)
          : 0
      });
    }

    return data;
  };

  // User lifecycle breakdown
  const getLifecycleBreakdown = () => {
    if (!userStats || !activityData) return [];

    const now = new Date();
    const activeUserIds = new Set(activityData.map(a => a.user_id));

    const categories = [
      { name: 'New (< 7 days)', count: 0, color: '#22c55e' },
      { name: 'Active', count: 0, color: '#3b82f6' },
      { name: 'At Risk (7-30 days)', count: 0, color: '#eab308' },
      { name: 'Churned (30+ days)', count: 0, color: '#ef4444' }
    ];

    userStats.forEach(user => {
      const daysSinceCreation = differenceInDays(now, new Date(user.created_at));
      const isActive = activeUserIds.has(user.id);

      if (daysSinceCreation <= 7) {
        categories[0].count++;
      } else if (isActive) {
        categories[1].count++;
      } else if (daysSinceCreation <= 30) {
        categories[2].count++;
      } else {
        categories[3].count++;
      }
    });

    return categories;
  };

  const metrics = calculateMetrics();
  const cohortData = generateCohortData();
  const lifecycleData = getLifecycleBreakdown();

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-white/60 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-blue-400">{metrics?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-white/60 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-green-400">{metrics?.activeUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-mansagold/10 border-mansagold/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-mansagold" />
              <div>
                <p className="text-white/60 text-sm">Retention Rate</p>
                <p className="text-2xl font-bold text-mansagold">{metrics?.retentionRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserMinus className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-white/60 text-sm">Churn Rate</p>
                <p className="text-2xl font-bold text-red-400">{metrics?.churnRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Retention Chart */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-mansagold" />
              Cohort Retention Over Time
            </CardTitle>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px] bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 months</SelectItem>
                <SelectItem value="6m">6 months</SelectItem>
                <SelectItem value="12m">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'white' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="signups" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Signups"
                />
                <Line 
                  type="monotone" 
                  dataKey="retained" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Still Active"
                />
                <Line 
                  type="monotone" 
                  dataKey="retention" 
                  stroke="#d4af37" 
                  strokeWidth={2}
                  name="Retention %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* User Lifecycle Breakdown */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-mansagold" />
            User Lifecycle Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lifecycleData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {lifecycleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {lifecycleData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                <span className="text-white/70 text-sm">{item.name}: {item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-mansagold" />
            Retention Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {metrics && (
            <>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start gap-3">
                  {metrics.retentionRate >= 40 ? (
                    <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-400 mt-0.5" />
                  )}
                  <div>
                    <p className="text-white font-medium">30-Day Retention</p>
                    <p className="text-white/60 text-sm">
                      {metrics.retentionRate >= 40 
                        ? `Good retention at ${metrics.retentionRate}%. Users are finding value in the platform.`
                        : `Retention at ${metrics.retentionRate}% needs improvement. Consider engagement campaigns.`
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">User Activity</p>
                    <p className="text-white/60 text-sm">
                      {metrics.activeUsers} of {metrics.totalUsers} users ({((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)}%) 
                      have been active in the last 30 days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start gap-3">
                  <UserMinus className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">At-Risk Users</p>
                    <p className="text-white/60 text-sm">
                      {metrics.inactiveUsers} users haven't been active recently. 
                      Consider re-engagement emails or notifications.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RetentionAnalytics;
