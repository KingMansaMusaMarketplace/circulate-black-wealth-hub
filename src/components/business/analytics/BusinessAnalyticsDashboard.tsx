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
    <Card>
      <CardContent className="flex items-center p-6">
        <Icon className={`h-8 w-8 mr-3 ${color}`} />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          {trend && (
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{trend}%</span> from last month
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
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Business Analytics</h2>
          <p className="text-muted-foreground">
            Track your business performance and engagement metrics
          </p>
        </div>
        <div className="flex gap-2">
          {insights && (
            <Button variant="outline" onClick={clearInsights}>
              Clear Insights
            </Button>
          )}
          <Button 
            onClick={handleGenerateInsights} 
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Business Insights
              <Badge variant="secondary" className="ml-2">
                Generated {new Date(insights.metadata.generatedAt).toLocaleDateString()}
              </Badge>
            </CardTitle>
            <CardDescription>{insights.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Insights */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Key Insights
              </h4>
              <div className="grid gap-3">
                {insights.keyInsights.map((insight, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{insight.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      </div>
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Quick Wins */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Wins
              </h4>
              <div className="grid gap-3">
                {insights.quickWins.map((win, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-green-800">{win.action}</h5>
                        <p className="text-sm text-green-600 mt-1">{win.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        <Clock className="h-3 w-3 mr-1" />
                        {win.timeframe}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Recommendations
              </h4>
              <div className="grid gap-3">
                {insights.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm flex-1">{rec.title}</h5>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {rec.category}
                        </Badge>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Trends & Next Steps */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Business Trends
                </h4>
                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      insights.trends.direction === 'positive' ? 'bg-green-500' : 
                      insights.trends.direction === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-sm font-medium capitalize">{insights.trends.direction} Trend</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{insights.trends.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {insights.trends.keyMetrics.map((metric, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Strategic Next Steps
                </h4>
                <div className="space-y-2">
                  {insights.nextSteps.map((step, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{step.step}</h5>
                          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
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
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Brain className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Get AI-Powered Business Insights</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Let our AI analyze your business data and provide personalized recommendations to grow your customer engagement and revenue.
            </p>
            <Button onClick={handleGenerateInsights} disabled={isGenerating}>
              <Brain className="mr-2 h-4 w-4" />
              Generate Your First AI Insights
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Profile Views" value={metrics.totalViews.toLocaleString()} icon={Eye} trend={12} color="text-blue-500" />
        <MetricCard title="QR Code Scans" value={metrics.totalScans} icon={QrCode} trend={8} color="text-green-500" />
        <MetricCard title="Social Shares" value={metrics.totalShares} icon={Share2} trend={15} color="text-purple-500" />
        <MetricCard title="Average Rating" value={metrics.avgRating} icon={Star} color="text-yellow-500" />
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Views Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>
                  Profile views and QR code scans over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} name="Views" />
                    <Line type="monotone" dataKey="scans" stroke="#10b981" strokeWidth={2} name="Scans" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>
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
              <CardTitle>Customer Engagement</CardTitle>
              <CardDescription>
                Detailed engagement metrics and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{metrics.totalViews}</p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{metrics.totalScans}</p>
                    <p className="text-sm text-muted-foreground">QR Scans</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{metrics.totalShares}</p>
                    <p className="text-sm text-muted-foreground">Shares</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{metrics.avgRating}</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>
                Customer demographics and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
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