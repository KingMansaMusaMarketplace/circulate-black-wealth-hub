import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Download, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { getMaterialAnalytics, getDownloadTrends, MaterialAnalytics, DownloadTrend } from '@/lib/api/marketing-analytics-api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { MaterialPerformanceInsights } from '@/components/marketing/MaterialPerformanceInsights';

const COLORS = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  banner: '#3b82f6',
  social: '#8b5cf6',
  email: '#10b981',
  document: '#f59e0b'
};

const MarketingAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<MaterialAnalytics[]>([]);
  const [trends, setTrends] = useState<DownloadTrend[]>([]);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }
    loadAnalytics();
  }, [userRole, navigate, dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const days = parseInt(dateRange);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');

      const [analyticsData, trendsData] = await Promise.all([
        getMaterialAnalytics(startDate, endDate),
        getDownloadTrends(startDate, endDate)
      ]);

      setAnalytics(analyticsData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const totalDownloads = analytics.reduce((sum, item) => sum + Number(item.total_downloads), 0);
  const totalUniqueAgents = new Set(analytics.flatMap(() => [])).size;
  const avgDownloadsPerMaterial = analytics.length > 0 ? totalDownloads / analytics.length : 0;

  // Prepare data for tier distribution
  const tierData = [
    { name: 'Bronze', value: analytics.reduce((sum, item) => sum + Number(item.bronze_downloads), 0), color: COLORS.bronze },
    { name: 'Silver', value: analytics.reduce((sum, item) => sum + Number(item.silver_downloads), 0), color: COLORS.silver },
    { name: 'Gold', value: analytics.reduce((sum, item) => sum + Number(item.gold_downloads), 0), color: COLORS.gold },
    { name: 'Platinum', value: analytics.reduce((sum, item) => sum + Number(item.platinum_downloads), 0), color: COLORS.platinum }
  ].filter(item => item.value > 0);

  // Prepare data for type distribution
  const typeData = analytics.reduce((acc, item) => {
    const existing = acc.find(d => d.name === item.material_type);
    if (existing) {
      existing.value += Number(item.total_downloads);
    } else {
      acc.push({
        name: item.material_type,
        value: Number(item.total_downloads),
        color: COLORS[item.material_type as keyof typeof COLORS] || '#888'
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; color: string }>);

  // Format trends data for chart
  const trendsChartData = trends.map(trend => ({
    date: format(new Date(trend.download_date), 'MMM dd'),
    total: Number(trend.download_count),
    banner: Number(trend.banner_count),
    social: Number(trend.social_count),
    email: Number(trend.email_count),
    document: Number(trend.document_count)
  }));

  if (loading) {
    return (
      <ResponsiveLayout title="Marketing Analytics">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Marketing Analytics">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/marketing-materials')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Materials
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Marketing Analytics</h1>
              <p className="text-muted-foreground text-lg">
                Track material performance and agent engagement
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all materials
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg per Material</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgDownloadsPerMaterial.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Average downloads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Materials</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.length}</div>
              <p className="text-xs text-muted-foreground">
                Total materials tracked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Performance Insights */}
        <MaterialPerformanceInsights dateRange={parseInt(dateRange)} />

        {/* Charts */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Download Trends</TabsTrigger>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
            <TabsTrigger value="tiers">Agent Tiers</TabsTrigger>
            <TabsTrigger value="types">Material Types</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Download Trends Over Time</CardTitle>
                <CardDescription>
                  Daily download activity for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} name="Total" />
                    <Line type="monotone" dataKey="banner" stroke={COLORS.banner} name="Banners" />
                    <Line type="monotone" dataKey="social" stroke={COLORS.social} name="Social" />
                    <Line type="monotone" dataKey="email" stroke={COLORS.email} name="Email" />
                    <Line type="monotone" dataKey="document" stroke={COLORS.document} name="Documents" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Materials</CardTitle>
                <CardDescription>
                  Top performing materials by download count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.slice(0, 10)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="material_title" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_downloads" fill="#8884d8" name="Downloads" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.slice(0, 6).map((material, index) => (
                <Card key={material.material_id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{material.material_title}</CardTitle>
                        <CardDescription className="text-xs capitalize">{material.material_type}</CardDescription>
                      </div>
                      <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Downloads:</span>
                        <span className="font-medium">{material.total_downloads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unique Agents:</span>
                        <span className="font-medium">{material.unique_agents}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Downloads by Agent Tier</CardTitle>
                  <CardDescription>
                    Distribution of downloads across agent tiers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={tierData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {tierData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tier Statistics</CardTitle>
                  <CardDescription>
                    Download counts by agent tier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tierData.map((tier) => (
                      <div key={tier.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: tier.color }}
                          />
                          <span className="font-medium">{tier.name}</span>
                        </div>
                        <span className="text-2xl font-bold">{tier.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="types" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Downloads by Material Type</CardTitle>
                  <CardDescription>
                    Distribution across different material types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Type Performance</CardTitle>
                  <CardDescription>
                    Download counts by material type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {typeData.map((type) => (
                      <div key={type.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: type.color }}
                          />
                          <span className="font-medium capitalize">{type.name}</span>
                        </div>
                        <span className="text-2xl font-bold">{type.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default MarketingAnalyticsPage;
