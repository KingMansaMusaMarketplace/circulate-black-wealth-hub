import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Lightbulb, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Insight {
  id: string;
  content: string;
  generatedAt: Date;
  dataSnapshot: Record<string, unknown>;
}

const AIInsightsGenerator: React.FC = () => {
  const [insights, setInsights] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const generateInsights = async () => {
    setLoading(true);
    
    try {
      // Fetch current platform data
      const [usersRes, businessesRes, transactionsRes, reviewsRes, agentsRes] = await Promise.all([
        supabase.from('profiles').select('id, created_at, user_type').limit(1000),
        supabase.from('businesses').select('id, created_at, is_verified, subscription_status, average_rating').limit(500),
        supabase.from('transactions').select('id, amount, type, created_at').limit(500),
        supabase.from('reviews').select('id, rating, created_at').limit(500),
        supabase.from('sales_agents').select('id, status, total_earnings, total_referrals, created_at').limit(100),
      ]);

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const dataSnapshot = {
        period: { start: weekAgo.toISOString(), end: now.toISOString() },
        users: {
          total: usersRes.data?.length || 0,
          newThisWeek: usersRes.data?.filter(u => new Date(u.created_at) > weekAgo).length || 0,
          newThisMonth: usersRes.data?.filter(u => new Date(u.created_at) > monthAgo).length || 0,
          byType: usersRes.data?.reduce((acc, u) => {
            acc[u.user_type || 'customer'] = (acc[u.user_type || 'customer'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
        businesses: {
          total: businessesRes.data?.length || 0,
          verified: businessesRes.data?.filter(b => b.is_verified).length || 0,
          active: businessesRes.data?.filter(b => b.subscription_status === 'active').length || 0,
          averageRating: businessesRes.data?.reduce((sum, b) => sum + (b.average_rating || 0), 0) / (businessesRes.data?.length || 1),
          newThisWeek: businessesRes.data?.filter(b => new Date(b.created_at) > weekAgo).length || 0,
        },
        transactions: {
          count: transactionsRes.data?.length || 0,
          totalVolume: transactionsRes.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
          thisWeek: transactionsRes.data?.filter(t => new Date(t.created_at) > weekAgo).length || 0,
        },
        reviews: {
          total: reviewsRes.data?.length || 0,
          averageRating: reviewsRes.data?.reduce((sum, r) => sum + (r.rating || 0), 0) / (reviewsRes.data?.length || 1),
          thisWeek: reviewsRes.data?.filter(r => new Date(r.created_at) > weekAgo).length || 0,
        },
        agents: {
          total: agentsRes.data?.length || 0,
          active: agentsRes.data?.filter(a => a.status === 'active').length || 0,
          totalEarnings: agentsRes.data?.reduce((sum, a) => sum + (a.total_earnings || 0), 0) || 0,
          totalReferrals: agentsRes.data?.reduce((sum, a) => sum + (a.total_referrals || 0), 0) || 0,
        },
      };

      const { data, error } = await supabase.functions.invoke('admin-ai-assistant', {
        body: {
          type: 'generate_insights',
          data: dataSnapshot,
        },
      });

      if (error) throw error;

      setInsights({
        id: crypto.randomUUID(),
        content: data.result,
        generatedAt: now,
        dataSnapshot,
      });
      setLastGenerated(now);
      toast.success('Insights generated successfully');

    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, []);

  const parseInsights = (content: string) => {
    const sections = {
      highlights: [] as string[],
      concerns: [] as string[],
      actions: [] as string[],
    };

    const lines = content.split('\n');
    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('highlight') || trimmed.toLowerCase().includes('key')) {
        currentSection = 'highlights';
      } else if (trimmed.toLowerCase().includes('concern') || trimmed.toLowerCase().includes('anomal')) {
        currentSection = 'concerns';
      } else if (trimmed.toLowerCase().includes('action') || trimmed.toLowerCase().includes('recommend')) {
        currentSection = 'actions';
      } else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.match(/^\d+\./)) {
        const item = trimmed.replace(/^[-•\d.]+\s*/, '');
        if (item && currentSection) {
          sections[currentSection as keyof typeof sections].push(item);
        }
      }
    }

    return sections;
  };

  const parsed = insights ? parseInsights(insights.content) : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              AI-Generated Insights
            </CardTitle>
            <CardDescription>
              Automated analysis of your platform performance
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {lastGenerated && (
              <span className="text-xs text-muted-foreground">
                Generated {format(lastGenerated, 'MMM d, h:mm a')}
              </span>
            )}
            <Button onClick={generateInsights} disabled={loading} size="sm">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !insights ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Analyzing platform data...</p>
            </div>
          </div>
        ) : insights ? (
          <div className="grid gap-4 md:grid-cols-3">
            {/* Highlights */}
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Key Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {parsed?.highlights.length ? parsed.highlights.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  )) : (
                    <li className="text-sm text-muted-foreground">No specific highlights identified</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Concerns */}
            <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Areas of Concern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {parsed?.concerns.length ? parsed.concerns.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  )) : (
                    <li className="text-sm text-muted-foreground">No significant concerns detected</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {parsed?.actions.length ? parsed.actions.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">{i + 1}</Badge>
                      {item}
                    </li>
                  )) : (
                    <li className="text-sm text-muted-foreground">No specific actions recommended</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Click refresh to generate insights
          </div>
        )}

        {/* Raw content fallback */}
        {insights && (
          <details className="mt-4">
            <summary className="text-sm text-muted-foreground cursor-pointer">View raw AI response</summary>
            <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto whitespace-pre-wrap">
              {insights.content}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsGenerator;
