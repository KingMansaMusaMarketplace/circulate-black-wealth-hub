
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, Building2, UserCheck, Calendar, TrendingUp, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, subMonths, subYears, startOfDay, startOfMonth, startOfYear } from 'date-fns';

type TimePeriod = '7days' | '30days' | '90days' | 'thisMonth' | 'thisYear' | 'allTime';

interface UserMetrics {
  total_users: number;
  total_customers: number;
  total_businesses: number;
  verified_businesses: number;
  daily_signups: Array<{
    date: string;
    customers: number;
    businesses: number;
    total: number;
  }>;
  subscription_breakdown: {
    active: number;
    trial: number;
    expired: number;
  };
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, trend, color }) => {
  const trendColor = trend === 'up' ? '#4ade80' : trend === 'down' ? '#f87171' : 'rgba(255,255,255,0.6)';
  
  return (
    <Card className="backdrop-blur-xl bg-white/5 border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p style={{ color: '#ffffff' }} className="text-sm font-medium">{title}</p>
            <p style={{ color: '#ffffff' }} className="text-3xl font-bold">{value}</p>
            <p style={{ color: trendColor }} className="text-sm flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {change}
            </p>
          </div>
          <div className="text-mansagold">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7days');

  const getTimePeriodConfig = (period: TimePeriod) => {
    const now = new Date();
    switch (period) {
      case '7days':
        return { days: 7, label: 'Last 7 Days', dateFormat: 'MMM dd' };
      case '30days':
        return { days: 30, label: 'Last 30 Days', dateFormat: 'MMM dd' };
      case '90days':
        return { days: 90, label: 'Last 90 Days', dateFormat: 'MMM dd' };
      case 'thisMonth':
        const daysThisMonth = Math.ceil((now.getTime() - startOfMonth(now).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return { days: daysThisMonth, label: 'This Month', dateFormat: 'MMM dd' };
      case 'thisYear':
        const daysThisYear = Math.ceil((now.getTime() - startOfYear(now).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return { days: daysThisYear, label: 'This Year', dateFormat: 'MMM' };
      case 'allTime':
        return { days: 365, label: 'All Time', dateFormat: 'MMM yyyy' };
      default:
        return { days: 7, label: 'Last 7 Days', dateFormat: 'MMM dd' };
    }
  };

  useEffect(() => {
    const fetchUserMetrics = async () => {
      setLoading(true);
      try {
        const periodConfig = getTimePeriodConfig(timePeriod);
        
        // Fetch total users and breakdown by type
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_type, subscription_status, created_at');

        if (profilesError) throw profilesError;

        // Fetch verified businesses
        const { data: businesses, error: businessError } = await supabase
          .from('businesses')
          .select('is_verified, created_at');

        if (businessError) throw businessError;

        // Process the data
        const totalUsers = profiles?.length || 0;
        const totalCustomers = profiles?.filter(p => p.user_type === 'customer').length || 0;
        const totalBusinesses = profiles?.filter(p => p.user_type === 'business').length || 0;
        const verifiedBusinesses = businesses?.filter(b => b.is_verified).length || 0;

        // Calculate subscription breakdown
        const subscriptionBreakdown = {
          active: profiles?.filter(p => p.subscription_status === 'active').length || 0,
          trial: profiles?.filter(p => p.subscription_status === 'trial').length || 0,
          expired: profiles?.filter(p => p.subscription_status === 'expired').length || 0,
        };

        // Generate signup data based on time period
        const dailySignups = [];
        const daysToShow = periodConfig.days;
        
        // For longer periods, aggregate by week or month
        const aggregateBy = daysToShow > 90 ? 'month' : daysToShow > 30 ? 'week' : 'day';
        
        if (aggregateBy === 'day') {
          for (let i = daysToShow - 1; i >= 0; i--) {
            const date = startOfDay(subDays(new Date(), i));
            const dateStr = format(date, 'yyyy-MM-dd');
            
            const dayProfiles = profiles?.filter(p => 
              format(new Date(p.created_at), 'yyyy-MM-dd') === dateStr
            ) || [];
            
            const customers = dayProfiles.filter(p => p.user_type === 'customer').length;
            const businessCount = dayProfiles.filter(p => p.user_type === 'business').length;
            
            dailySignups.push({
              date: format(date, periodConfig.dateFormat),
              customers,
              businesses: businessCount,
              total: customers + businessCount
            });
          }
        } else if (aggregateBy === 'week') {
          const weeks = Math.ceil(daysToShow / 7);
          for (let i = weeks - 1; i >= 0; i--) {
            const weekStart = startOfDay(subDays(new Date(), i * 7 + 6));
            const weekEnd = startOfDay(subDays(new Date(), i * 7));
            
            const weekProfiles = profiles?.filter(p => {
              const createdAt = new Date(p.created_at);
              return createdAt >= weekStart && createdAt <= weekEnd;
            }) || [];
            
            const customers = weekProfiles.filter(p => p.user_type === 'customer').length;
            const businessCount = weekProfiles.filter(p => p.user_type === 'business').length;
            
            dailySignups.push({
              date: format(weekEnd, 'MMM dd'),
              customers,
              businesses: businessCount,
              total: customers + businessCount
            });
          }
        } else {
          // Monthly aggregation
          const months = Math.min(12, Math.ceil(daysToShow / 30));
          for (let i = months - 1; i >= 0; i--) {
            const monthDate = subMonths(new Date(), i);
            const monthStr = format(monthDate, 'yyyy-MM');
            
            const monthProfiles = profiles?.filter(p => 
              format(new Date(p.created_at), 'yyyy-MM') === monthStr
            ) || [];
            
            const customers = monthProfiles.filter(p => p.user_type === 'customer').length;
            const businessCount = monthProfiles.filter(p => p.user_type === 'business').length;
            
            dailySignups.push({
              date: format(monthDate, 'MMM yyyy'),
              customers,
              businesses: businessCount,
              total: customers + businessCount
            });
          }
        }

        setMetrics({
          total_users: totalUsers,
          total_customers: totalCustomers,
          total_businesses: totalBusinesses,
          verified_businesses: verifiedBusinesses,
          daily_signups: dailySignups,
          subscription_breakdown: subscriptionBreakdown
        });
      } catch (error) {
        console.error('Error fetching user metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMetrics();
  }, [timePeriod]);

  const userTypeData = [
    { name: 'Customers', value: metrics?.total_customers || 0, color: '#1E40AF' },
    { name: 'Businesses', value: metrics?.total_businesses || 0, color: '#FFD700' }
  ];

  const subscriptionData = [
    { name: 'Active', value: metrics?.subscription_breakdown.active || 0, color: '#059669' },
    { name: 'Trial', value: metrics?.subscription_breakdown.trial || 0, color: '#F59E0B' },
    { name: 'Expired', value: metrics?.subscription_breakdown.expired || 0, color: '#DC2626' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansablue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 style={{ color: '#ffffff' }} className="text-2xl font-bold">Admin Analytics</h2>
        <div style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={metrics?.total_users || 0}
          change="+12% this week"
          icon={<Users className="h-8 w-8" />}
          trend="up"
          color="text-mansablue"
        />
        <MetricCard
          title="Customers"
          value={metrics?.total_customers || 0}
          change="+8% this week"
          icon={<UserCheck className="h-8 w-8" />}
          trend="up"
          color="text-blue-600"
        />
        <MetricCard
          title="Businesses"
          value={metrics?.total_businesses || 0}
          change="+15% this week"
          icon={<Building2 className="h-8 w-8" />}
          trend="up"
          color="text-mansagold"
        />
        <MetricCard
          title="Verified Businesses"
          value={metrics?.verified_businesses || 0}
          change="+5% this week"
          icon={<Shield className="h-8 w-8" />}
          trend="up"
          color="text-green-600"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="signups">Daily Signups</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {userTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {userTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span style={{ color: '#ffffff' }} className="text-sm">{item.name}</span>
                      </div>
                      <span style={{ color: '#ffffff' }} className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Signups ({getTimePeriodConfig(timePeriod).label})</CardTitle>
                <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="thisYear">This Year</SelectItem>
                    <SelectItem value="allTime">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics?.daily_signups || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#1E40AF" strokeWidth={3} name="Total" />
                    <Line type="monotone" dataKey="customers" stroke="#059669" strokeWidth={2} name="Customers" />
                    <Line type="monotone" dataKey="businesses" stroke="#FFD700" strokeWidth={2} name="Businesses" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="signups" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Signup Trends ({getTimePeriodConfig(timePeriod).label})</CardTitle>
              <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                  <SelectItem value="allTime">All Time</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={metrics?.daily_signups || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="customers" fill="#1E40AF" name="Customers" />
                  <Bar dataKey="businesses" fill="#FFD700" name="Businesses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-mansagold mx-auto mb-2" />
                <div style={{ color: '#ffffff' }} className="text-2xl font-bold">{metrics?.total_users || 0}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">Total Registered Users</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <UserCheck className="h-12 w-12 text-mansagold mx-auto mb-2" />
                <div style={{ color: '#ffffff' }} className="text-2xl font-bold">{metrics?.total_customers || 0}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">Customer Accounts</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-xl bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Building2 className="h-12 w-12 text-mansagold mx-auto mb-2" />
                <div style={{ color: '#ffffff' }} className="text-2xl font-bold">{metrics?.total_businesses || 0}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">Business Accounts</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {subscriptionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span style={{ color: '#ffffff' }} className="text-sm">{item.name}</span>
                    </div>
                    <span style={{ color: '#ffffff' }} className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsDashboard;
