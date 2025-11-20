import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, Share2, QrCode, Star, Brain, Lightbulb, Target, Zap, Clock, ArrowRight } from 'lucide-react';
import { useAIBusinessInsights } from '@/hooks/use-ai-business-insights';
import { toast } from 'sonner';

const BusinessAnalyticsDashboard = ({ businessId }: { businessId: string }) => {
  const { insights, isGenerating, generateInsights, clearInsights } = useAIBusinessInsights();
  
  // Mock data - in a real app, this would come from your analytics API
  const metrics = {
    totalViews: 1247,
    totalScans: 89,
    totalShares: 156,
    avgRating: 4.7,
    reviewCount: 23
  };

  const viewsData = [
    { month: 'Jan', views: 186, scans: 12 },
    { month: 'Feb', views: 205, scans: 19 },
    { month: 'Mar', views: 237, scans: 25 },
    { month: 'Apr', views: 308, scans: 31 },
    { month: 'May', views: 269, scans: 22 },
    { month: 'Jun', views: 214, scans: 18 }
  ];

  const categoryData = [
    { name: 'Restaurant', value: 35, color: '#d4af37' },
    { name: 'Retail', value: 25, color: '#1a1a1a' },
    { name: 'Services', value: 20, color: '#6b7280' },
    { name: 'Other', value: 20, color: '#f59e0b' }
  ];

  const MetricCard = ({ title, value, icon: Icon, trend, color = "text-blue-600" }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    trend?: number;
    color?: string;
  }) => (
    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
      <CardContent className="flex items-center p-6">
        <Icon className={`h-8 w-8 mr-3 ${color}`} />
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-white/70">{title}</p>
          {trend && (
            <p className="text-xs text-white/60">
              <span className="text-green-400">+{trend}%</span> from last month
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const handleGenerateInsights = async () => {
    if (!businessId) {
      toast.error('Business ID is required');
      return;
    }
    await generateInsights(businessId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Business Analytics</h2>
            <p className="text-white/70">
              Track your business performance and engagement metrics
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {insights && (
          <Button variant="outline" onClick={clearInsights} className="border-white/20 text-white hover:bg-white/10">
            Clear Insights
          </Button>
        )}
        <Button 
          onClick={handleGenerateInsights} 
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-600 to-yellow-600 hover:from-blue-700 hover:to-yellow-700 text-white"
        >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating AI Insights...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate AI Insights
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Insights Section */}
      {insights && (
        <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="h-5 w-5 text-yellow-400" />
              AI Business Insights
              <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
                Generated {new Date(insights.metadata.generatedAt).toLocaleDateString()}
              </Badge>
            </CardTitle>
            <CardDescription className="text-white/70">{insights.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Insights */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                Key Insights
              </h4>
              <div className="grid gap-3">
                {insights.keyInsights.map((insight, index) => (
                  <div key={index} className="p-3 bg-slate-800/30 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-white">{insight.title}</h5>
                        <p className="text-sm text-white/70 mt-1">{insight.description}</p>
                      </div>
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Quick Wins */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
                <Zap className="h-4 w-4 text-yellow-400" />
                Quick Wins
              </h4>
              <div className="grid gap-3">
                {insights.quickWins.map((win, index) => (
                  <div key={index} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-green-300">{win.action}</h5>
                        <p className="text-sm text-green-400/70 mt-1">{win.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                        <Clock className="h-3 w-3 mr-1" />
                        {win.timeframe}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
                <Target className="h-4 w-4 text-blue-400" />
                Recommendations
              </h4>
              <div className="grid gap-3">
                {insights.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 bg-slate-800/30 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm flex-1 text-white">{rec.title}</h5>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {rec.category}
                        </Badge>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Trends & Next Steps */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  Business Trends
                </h4>
                <div className="p-3 bg-slate-800/30 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      insights.trends.direction === 'positive' ? 'bg-green-400' : 
                      insights.trends.direction === 'negative' ? 'bg-red-400' : 'bg-yellow-400'
                    }`} />
                    <span className="text-sm font-medium capitalize text-white">{insights.trends.direction} Trend</span>
                  </div>
                  <p className="text-sm text-white/70 mb-2">{insights.trends.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {insights.trends.keyMetrics.map((metric, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
                  <ArrowRight className="h-4 w-4 text-yellow-400" />
                  Strategic Next Steps
                </h4>
                <div className="space-y-2">
                  {insights.nextSteps.map((step, index) => (
                    <div key={index} className="p-3 bg-slate-800/30 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-white">{step.step}</h5>
                          <p className="text-sm text-white/70 mt-1">{step.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {step.timeline}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!insights && (
        <Card className="border-dashed border-2 border-white/20 bg-slate-900/20 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Brain className="h-12 w-12 text-yellow-400/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">Get AI-Powered Business Insights</h3>
            <p className="text-white/70 mb-4 max-w-md">
              Let our AI analyze your business data and provide personalized recommendations to grow your customer engagement and revenue.
            </p>
            <Button onClick={handleGenerateInsights} disabled={isGenerating} className="bg-gradient-to-r from-blue-600 to-yellow-600 hover:from-blue-700 hover:to-yellow-700 text-white">
              <Brain className="mr-2 h-4 w-4" />
              Generate Your First AI Insights
            </Button>
          </CardContent>
        </Card>
      )}

      <Separator className="bg-white/10" />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Profile Views" value={metrics.totalViews.toLocaleString()} icon={Eye} trend={12} color="text-blue-400" />
        <MetricCard title="QR Code Scans" value={metrics.totalScans} icon={QrCode} trend={8} color="text-green-400" />
        <MetricCard title="Social Shares" value={metrics.totalShares} icon={Share2} trend={15} color="text-purple-400" />
        <MetricCard title="Average Rating" value={metrics.avgRating} icon={Star} color="text-yellow-400" />
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-900/40 backdrop-blur-xl border border-white/10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 text-white">Overview</TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-white/10 text-white">Engagement</TabsTrigger>
          <TabsTrigger value="demographics" className="data-[state=active]:bg-white/10 text-white">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Views Chart */}
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Monthly Performance</CardTitle>
                <CardDescription className="text-white/70">
                  Profile views and QR code scans over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} name="Views" />
                    <Line type="monotone" dataKey="scans" stroke="#d4af37" strokeWidth={2} name="Scans" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Category Performance</CardTitle>
                <CardDescription className="text-white/70">
                  Overall business performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Customer Engagement</CardTitle>
              <CardDescription className="text-white/70">
                Detailed engagement metrics and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-white/10">
                    <p className="text-2xl font-bold text-blue-400">{metrics.totalViews}</p>
                    <p className="text-sm text-white/70">Total Views</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-white/10">
                    <p className="text-2xl font-bold text-green-400">{metrics.totalScans}</p>
                    <p className="text-sm text-white/70">QR Scans</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-white/10">
                    <p className="text-2xl font-bold text-purple-400">{metrics.totalShares}</p>
                    <p className="text-sm text-white/70">Shares</p>
                  </div>
                  <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-white/10">
                    <p className="text-2xl font-bold text-yellow-400">{metrics.avgRating}</p>
                    <p className="text-sm text-white/70">Rating</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Audience Demographics</CardTitle>
              <CardDescription className="text-white/70">
                Customer demographics and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-white/70">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Demographics data will be available once you have more customer interactions.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessAnalyticsDashboard;