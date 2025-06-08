
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, Share2, QrCode, Star } from 'lucide-react';

const BusinessAnalyticsDashboard = ({ businessId }: { businessId: string }) => {
  // Mock data - in a real app, this would come from your analytics API
  const metrics = {
    totalViews: 1247,
    totalScans: 89,
    totalShares: 156,
    avgRating: 4.7,
    reviewCount: 23
  };

  const viewsData = [
    { month: 'Jan', views: 120, scans: 15 },
    { month: 'Feb', views: 180, scans: 22 },
    { month: 'Mar', views: 160, scans: 18 },
    { month: 'Apr', views: 200, scans: 25 },
    { month: 'May', views: 240, scans: 30 },
    { month: 'Jun', views: 300, scans: 35 }
  ];

  const categoryData = [
    { name: 'Direct Links', value: 45, color: '#8884d8' },
    { name: 'Search Results', value: 30, color: '#82ca9d' },
    { name: 'Social Media', value: 15, color: '#ffc658' },
    { name: 'QR Codes', value: 10, color: '#ff7300' }
  ];

  const MetricCard = ({ title, value, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+{trend}%</span> from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Business Analytics</h2>
        <p className="text-muted-foreground">
          Track your business performance and engagement metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Views"
          value={metrics.totalViews.toLocaleString()}
          icon={Eye}
          trend={12}
        />
        <MetricCard
          title="QR Scans"
          value={metrics.totalScans}
          icon={QrCode}
          trend={8}
        />
        <MetricCard
          title="Social Shares"
          value={metrics.totalShares}
          icon={Share2}
          trend={15}
        />
        <MetricCard
          title="Average Rating"
          value={metrics.avgRating}
          icon={Star}
          trend={5}
        />
        <MetricCard
          title="Reviews"
          value={metrics.reviewCount}
          icon={Users}
          trend={20}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Views & QR Scans Over Time</CardTitle>
              <CardDescription>
                Track how your business engagement has grown over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="scans" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Where your customers are discovering your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>
                Overall business performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessAnalyticsDashboard;
