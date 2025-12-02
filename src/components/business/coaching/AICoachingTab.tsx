import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AIBusinessDescriptionGenerator } from '../AIBusinessDescriptionGenerator';

interface AICoachingTabProps {
  businessId: string;
}

export const AICoachingTab: React.FC<AICoachingTabProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadInsights();
  }, [businessId]);

  const loadInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('business_insights')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-business-insights', {
        body: { businessId }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Generated ${data.insights.length} new insights`,
      });

      loadInsights();
    } catch (error: any) {
      console.error('Error generating insights:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate insights',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <TrendingUp className="h-5 w-5" />;
      case 'customer_engagement': return <Target className="h-5 w-5" />;
      case 'operations': return <AlertCircle className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Tools Section */}
      <div>
        <h3 className="text-2xl font-bold mb-2">AI Tools</h3>
        <p className="text-muted-foreground mb-6">Powerful AI features to enhance your business</p>
        <AIBusinessDescriptionGenerator />
      </div>

      {/* Business Insights Section */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div>
          <h3 className="text-2xl font-bold">AI Business Coach</h3>
          <p className="text-muted-foreground">Get personalized insights to grow your business</p>
        </div>
        <Button onClick={generateInsights} disabled={generating}>
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate New Insights
            </>
          )}
        </Button>
      </div>

      {insights.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No insights yet</p>
            <p className="text-muted-foreground mb-4">
              Generate AI-powered insights based on your business data
            </p>
            <Button onClick={generateInsights} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Insights
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {insights.map((insight) => (
            <Card key={insight.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {getTypeIcon(insight.insight_type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {format(new Date(insight.created_at), 'MMM dd, yyyy')}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(insight.priority)}>
                    {insight.priority} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{insight.description}</p>
                
                {insight.recommendations && insight.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Recommendations:</h4>
                    <ul className="space-y-2">
                      {insight.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};