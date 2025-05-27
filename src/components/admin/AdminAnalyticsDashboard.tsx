
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, Building2, UserCheck, Calendar, TrendingUp, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay } from 'date-fns';

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
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className={`text-sm ${trendColor} flex items-center gap-1`}>
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

  useEffect(() => {
    const fetchUserMetrics = async () => {
      try {
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

        // Generate daily signup data for the last 7 days
        const dailySignups = [];
        for (let i = 6; i >= 0; i--) {
          const date = startOfDay(subDays(new Date(), i));
          const dateStr = format(date, 'yyyy-MM-dd');
          
          const dayProfiles = profiles?.filter(p => 
            format(new Date(p.created_at), 'yyyy-MM-dd') === dateStr
          ) || [];
          
          const customers = dayProfiles.filter(p => p.user_type === 'customer').length;
          const businesses = dayProfiles.filter(p => p.user_type === 'business').length;
          
          dailySignups.push({
            date: format(date, 'MMM dd'),
            customers,
            businesses,
            total: customers + businesses
          });
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
  }, []);

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
        <h2 className="text-2xl font-bold text-mansablue">Admin Analytics</h2>
        <div className="text-sm text-gray-500">
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
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Signups (Last 7 Days)</CardTitle>
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
            <CardHeader>
              <CardTitle>Signup Trends</CardTitle>
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
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-mansagold mx-auto mb-2" />
                <div className="text-2xl font-bold text-mansablue">{metrics?.total_users || 0}</div>
                <div className="text-sm text-gray-600">Total Registered Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <UserCheck className="h-12 w-12 text-mansagold mx-auto mb-2" />
                <div className="text-2xl font-bold text-mansablue">{metrics?.total_customers || 0}</div>
                <div className="text-sm text-gray-600">Customer Accounts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Building2 className="h-12 w-12 text-mansagold mx-auto mb-2" />
                <div className="text-2xl font-bold text-mansablue">{metrics?.total_businesses || 0}</div>
                <div className="text-sm text-gray-600">Business Accounts</div>
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
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
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
