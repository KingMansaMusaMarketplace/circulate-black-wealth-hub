import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, TrendingDown, Lightbulb, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { getMaterialPerformanceAnalysis, PerformanceAnalysis } from '@/lib/api/material-performance-api';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface MaterialPerformanceInsightsProps {
  dateRange?: number;
}

export const MaterialPerformanceInsights: React.FC<MaterialPerformanceInsightsProps> = ({ 
  dateRange = 30 
}) => {
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalysis = async () => {
    try {
      setRefreshing(true);
      const data = await getMaterialPerformanceAnalysis(dateRange);
      setAnalysis(data);
    } catch (error) {
      console.error('Failed to load performance analysis:', error);
      toast.error('Failed to load AI insights');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, [dateRange]);

  if (loading) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  const parseInsights = (insightsText: string) => {
    const sections: Record<string, string[]> = {
      insights: [],
      concerns: [],
      strategies: [],
      suggestions: []
    };

    const lines = insightsText.split('\n');
    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.toLowerCase().includes('key insight') || trimmed.toLowerCase().includes('working well')) {
        currentSection = 'insights';
      } else if (trimmed.toLowerCase().includes('concern') || trimmed.toLowerCase().includes('area of concern')) {
        currentSection = 'concerns';
      } else if (trimmed.toLowerCase().includes('optimization') || trimmed.toLowerCase().includes('recommendation')) {
        currentSection = 'strategies';
      } else if (trimmed.toLowerCase().includes('creation') || trimmed.toLowerCase().includes('suggest')) {
        currentSection = 'suggestions';
      } else if (trimmed.match(/^[-•*]\s/) || trimmed.match(/^\d+\./)) {
        const cleanText = trimmed.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '');
        if (currentSection && cleanText) {
          sections[currentSection].push(cleanText);
        }
      }
    }

    return sections;
  };

  const sections = parseInsights(analysis.ai_insights);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.summary.total_materials}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.summary.total_downloads.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analysis.summary.total_conversions}</div>
            <p className="text-xs text-muted-foreground mt-1">Referrals from materials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.summary.avg_conversion_rate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Insights */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle>AI-Powered Performance Insights</CardTitle>
            </div>
            <Button
              onClick={loadAnalysis}
              disabled={refreshing}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </Button>
          </div>
          <CardDescription>
            AI-generated insights and optimization strategies for last {dateRange} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="insights">What's Working</TabsTrigger>
              <TabsTrigger value="concerns">Concerns</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-3 mt-4">
              {sections.insights.length > 0 ? (
                sections.insights.map((insight, idx) => (
                  <Card key={idx} className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                    <CardContent className="pt-4 flex gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{insight}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No specific insights available.</p>
              )}
            </TabsContent>

            <TabsContent value="concerns" className="space-y-3 mt-4">
              {sections.concerns.length > 0 ? (
                sections.concerns.map((concern, idx) => (
                  <Card key={idx} className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                    <CardContent className="pt-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{concern}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No specific concerns identified.</p>
              )}
            </TabsContent>

            <TabsContent value="strategies" className="space-y-3 mt-4">
              {sections.strategies.length > 0 ? (
                sections.strategies.map((strategy, idx) => (
                  <Card key={idx} className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <CardContent className="pt-4 flex gap-3">
                      <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{strategy}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No specific strategies recommended.</p>
              )}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-3 mt-4">
              {sections.suggestions.length > 0 ? (
                sections.suggestions.map((suggestion, idx) => (
                  <Card key={idx} className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
                    <CardContent className="pt-4 flex gap-3">
                      <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{suggestion}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No specific suggestions available.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Performing Materials
          </CardTitle>
          <CardDescription>Materials driving the most conversions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.top_performers.slice(0, 5).map((material, idx) => (
              <div key={material.id} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{material.title}</p>
                    <Badge variant="secondary" className="text-xs">{material.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{material.total_downloads} downloads</span>
                    <span className="text-green-600 font-medium">{material.conversions} conversions</span>
                    <span>{material.conversion_rate.toFixed(1)}% rate</span>
                  </div>
                  <Progress value={material.conversion_rate} className="mt-2 h-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Underperformers */}
      {analysis.underperformers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-amber-600" />
              Materials Needing Attention
            </CardTitle>
            <CardDescription>High downloads but low conversion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.underperformers.map((material) => (
                <div key={material.id} className="flex items-center gap-4">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{material.title}</p>
                      <Badge variant="outline" className="text-xs">{material.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{material.total_downloads} downloads</span>
                      <span className="text-amber-600">{material.conversion_rate.toFixed(1)}% rate</span>
                    </div>
                    <Progress value={material.conversion_rate} className="mt-2 h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
