import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Download, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
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
      toast.error('Access Denied', {
        description: 'You need administrator privileges to access this page. Please contact an admin if you believe you should have access.',
        duration: 5000,
      });
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
      <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-mansablue/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-mansagold/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mansagold"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-mansablue/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-mansagold/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/3 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/marketing-materials')}
            className="mb-4 text-slate-300 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Materials
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-mansagold/20 to-mansablue/20 border border-mansagold/30">
                  <Sparkles className="h-6 w-6 text-mansagold" />
                </div>
                <h1 className="text-4xl font-bold text-white">Marketing Analytics</h1>
              </div>
              <p className="text-slate-400 text-lg">
                Track material performance and agent engagement
              </p>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white backdrop-blur-sm focus:border-mansagold/50 focus:ring-1 focus:ring-mansagold/50 outline-none"
            >
              <option value="7" className="bg-[#0a1628]">Last 7 days</option>
              <option value="30" className="bg-[#0a1628]">Last 30 days</option>
              <option value="90" className="bg-[#0a1628]">Last 90 days</option>
              <option value="365" className="bg-[#0a1628]">Last year</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-mansagold/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-400">Total Downloads</span>
              <Download className="h-5 w-5 text-mansagold" />
            </div>
            <div className="text-3xl font-bold text-white">{totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Across all materials</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-mansagold/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-400">Avg per Material</span>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">{avgDownloadsPerMaterial.toFixed(1)}</div>
            <p className="text-xs text-slate-500 mt-1">Average downloads</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-mansagold/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-400">Active Materials</span>
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white">{analytics.length}</div>
            <p className="text-xs text-slate-500 mt-1">Total materials tracked</p>
          </div>
        </div>

        {/* AI Performance Insights */}
        <div className="mb-8">
          <MaterialPerformanceInsights dateRange={parseInt(dateRange)} />
        </div>

        {/* Charts */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 backdrop-blur-sm p-1">
            <TabsTrigger value="trends" className="data-[state=active]:bg-mansagold/20 data-[state=active]:text-mansagold text-slate-400">
              Download Trends
            </TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-mansagold/20 data-[state=active]:text-mansagold text-slate-400">
              Most Popular
            </TabsTrigger>
            <TabsTrigger value="tiers" className="data-[state=active]:bg-mansagold/20 data-[state=active]:text-mansagold text-slate-400">
              Agent Tiers
            </TabsTrigger>
            <TabsTrigger value="types" className="data-[state=active]:bg-mansagold/20 data-[state=active]:text-mansagold text-slate-400">
              Material Types
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Download Trends Over Time</h3>
                <p className="text-sm text-slate-400">Daily download activity for the selected period</p>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 22, 40, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="total" stroke="#d4af37" strokeWidth={2} name="Total" />
                  <Line type="monotone" dataKey="banner" stroke={COLORS.banner} name="Banners" />
                  <Line type="monotone" dataKey="social" stroke={COLORS.social} name="Social" />
                  <Line type="monotone" dataKey="email" stroke={COLORS.email} name="Email" />
                  <Line type="monotone" dataKey="document" stroke={COLORS.document} name="Documents" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Most Popular Materials</h3>
                <p className="text-sm text-slate-400">Top performing materials by download count</p>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis dataKey="material_title" type="category" width={150} stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 22, 40, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Bar dataKey="total_downloads" fill="#d4af37" name="Downloads" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.slice(0, 6).map((material, index) => (
                <div key={material.material_id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-mansagold/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-base font-semibold text-white">{material.material_title}</h4>
                      <p className="text-xs text-slate-400 capitalize">{material.material_type}</p>
                    </div>
                    <span className="text-2xl font-bold text-mansagold">#{index + 1}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Downloads:</span>
                      <span className="font-medium text-white">{material.total_downloads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Unique Agents:</span>
                      <span className="font-medium text-white">{material.unique_agents}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white">Downloads by Agent Tier</h3>
                  <p className="text-sm text-slate-400">Distribution of downloads across agent tiers</p>
                </div>
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
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(10, 22, 40, 0.95)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white">Tier Statistics</h3>
                  <p className="text-sm text-slate-400">Download counts by agent tier</p>
                </div>
                <div className="space-y-4">
                  {tierData.map((tier) => (
                    <div key={tier.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: tier.color }}
                        />
                        <span className="font-medium text-white">{tier.name}</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{tier.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="types" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white">Downloads by Material Type</h3>
                  <p className="text-sm text-slate-400">Distribution across different material types</p>
                </div>
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
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(10, 22, 40, 0.95)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white">Type Performance</h3>
                  <p className="text-sm text-slate-400">Download counts by material type</p>
                </div>
                <div className="space-y-4">
                  {typeData.map((type) => (
                    <div key={type.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="font-medium text-white capitalize">{type.name}</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{type.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketingAnalyticsPage;
