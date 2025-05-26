import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, Share2, Calendar, Star, QrCode, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessProfile } from '@/hooks/use-business-profile';

interface AnalyticsData {
  total_views: number;
  total_scans: number;
  total_shares: number;
  avg_daily_views: number;
  recent_activity: Array<{
    date: string;
    metric_type: string;
    value: number;
  }>;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, trend }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-mansablue">{value}</p>
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

const BusinessAnalyticsDashboard: React.FC = () => {
  const { profile } = useBusinessProfile();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!profile?.id) return;

      try {
        const { data, error } = await supabase.rpc('get_business_analytics_summary', {
          p_business_id: profile.id
        });

        if (error) throw error;
        
        // Properly type the response data
        if (data && typeof data === 'object') {
          const typedData: AnalyticsData = {
            total_views: Number(data.total_views) || 0,
            total_scans: Number(data.total_scans) || 0,
            total_shares: Number(data.total_shares) || 0,
            avg_daily_views: Number(data.avg_daily_views) || 0,
            recent_activity: Array.isArray(data.recent_activity) ? data.recent_activity : []
          };
          setAnalytics(typedData);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [profile?.id]);

  // Sample data for charts
  const weeklyData = [
    { name: 'Mon', views: 45, scans: 12, shares: 3 },
    { name: 'Tue', views: 52, scans: 15, shares: 5 },
    { name: 'Wed', views: 48, scans: 18, shares: 4 },
    { name: 'Thu', views: 61, scans: 22, shares: 7 },
    { name: 'Fri', views: 73, scans: 28, shares: 9 },
    { name: 'Sat', views: 89, scans: 35, shares: 12 },
    { name: 'Sun', views: 67, scans: 24, shares: 8 }
  ];

  const customerSegments = [
    { name: 'New Customers', value: 35, color: '#FFD700' },
    { name: 'Returning Customers', value: 45, color: '#1E40AF' },
    { name: 'VIP Customers', value: 20, color: '#059669' }
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
        <h2 className="text-2xl font-bold text-mansablue">Business Analytics</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Profile Views"
          value={analytics?.total_views || 0}
          change="+12% from last week"
          icon={<Eye className="h-8 w-8" />}
          trend="up"
        />
        <MetricCard
          title="QR Code Scans"
          value={analytics?.total_scans || 0}
          change="+8% from last week"
          icon={<QrCode className="h-8 w-8" />}
          trend="up"
        />
        <MetricCard
          title="Social Shares"
          value={analytics?.total_shares || 0}
          change="+15% from last week"
          icon={<Share2 className="h-8 w-8" />}
          trend="up"
        />
        <MetricCard
          title="Avg Daily Views"
          value={Math.round(analytics?.avg_daily_views || 0)}
          change="+5% from last week"
          icon={<Target className="h-8 w-8" />}
          trend="up"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#1E40AF" strokeWidth={3} />
                    <Line type="monotone" dataKey="scans" stroke="#FFD700" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scans" fill="#FFD700" />
                  <Bar dataKey="shares" fill="#1E40AF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-mansagold mx-auto mb-2" />
                <div className="text-2xl font-bold text-mansablue">1,234</div>
                <div className="text-sm text-gray-600">Total Customers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-mansagold mx-auto mb-2" />
                <div className="text-2xl font-bold text-mansablue">4.8</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-mansagold mx-auto mb-2" />
                <div className="text-2xl font-bold text-mansablue">156</div>
                <div className="text-sm text-gray-600">Repeat Customers</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Monthly Growth Rate</span>
                  <span className="text-green-600 font-bold">+18.5%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Customer Retention Rate</span>
                  <span className="text-green-600 font-bold">78%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Average Customer Lifetime</span>
                  <span className="text-mansablue font-bold">8 months</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessAnalyticsDashboard;
