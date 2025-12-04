import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { ShieldAlert, Bot, Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ActivityData {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: Record<string, unknown>;
  created_at: string;
  user_name?: string;
  aiAnalysis?: {
    risk_score: number;
    risk_level: string;
    indicators: string[];
    recommendation: string;
    confidence: number;
  };
  analyzing?: boolean;
}

const AIFraudDetection: React.FC = () => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ high: 0, medium: 0, low: 0, analyzed: 0 });

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select(`
          id,
          user_id,
          activity_type,
          activity_data,
          created_at,
          profiles:user_id(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setActivities((data || []).map(a => ({
        id: a.id,
        user_id: a.user_id,
        activity_type: a.activity_type,
        activity_data: a.activity_data as Record<string, unknown> || {},
        created_at: a.created_at,
        user_name: (a.profiles as unknown as { full_name: string } | null)?.full_name,
      })));
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    const analyzed = activities.filter(a => a.aiAnalysis);
    setStats({
      high: analyzed.filter(a => a.aiAnalysis?.risk_level === 'high' || a.aiAnalysis?.risk_level === 'critical').length,
      medium: analyzed.filter(a => a.aiAnalysis?.risk_level === 'medium').length,
      low: analyzed.filter(a => a.aiAnalysis?.risk_level === 'low').length,
      analyzed: analyzed.length,
    });
  }, [activities]);

  const analyzeActivity = async (activity: ActivityData) => {
    setActivities(prev => prev.map(a => 
      a.id === activity.id ? { ...a, analyzing: true } : a
    ));

    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-assistant', {
        body: {
          type: 'fraud_analysis',
          data: {
            activityType: activity.activity_type,
            activityData: activity.activity_data,
            timestamp: activity.created_at,
            userId: activity.user_id,
          },
        },
      });

      if (error) throw error;

      let analysis;
      try {
        const jsonMatch = data.result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        analysis = {
          risk_score: 25,
          risk_level: 'low',
          indicators: [],
          recommendation: data.result,
          confidence: 50,
        };
      }

      setActivities(prev => prev.map(a => 
        a.id === activity.id ? { ...a, aiAnalysis: analysis, analyzing: false } : a
      ));

    } catch (error) {
      console.error('Error analyzing activity:', error);
      toast.error('Failed to analyze activity');
      setActivities(prev => prev.map(a => 
        a.id === activity.id ? { ...a, analyzing: false } : a
      ));
    }
  };

  const analyzeAll = async () => {
    const unanalyzed = activities.filter(a => !a.aiAnalysis);
    for (const activity of unanalyzed.slice(0, 10)) { // Limit to 10 to avoid rate limits
      await analyzeActivity(activity);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    toast.success('Batch analysis complete');
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Critical</Badge>;
      case 'high':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" />Medium</Badge>;
      default:
        return <Badge variant="secondary"><CheckCircle className="h-3 w-3 mr-1" />Low</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.analyzed}</p>
              <p className="text-sm text-muted-foreground">Analyzed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{stats.high}</p>
              <p className="text-sm text-muted-foreground">High Risk</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">{stats.medium}</p>
              <p className="text-sm text-muted-foreground">Medium Risk</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{stats.low}</p>
              <p className="text-sm text-muted-foreground">Low Risk</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                AI Fraud Detection
              </CardTitle>
              <CardDescription>
                AI-powered analysis of suspicious activities
              </CardDescription>
            </div>
            <Button onClick={analyzeAll} disabled={loading}>
              <Bot className="h-4 w-4 mr-2" />
              Analyze Recent
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Indicators</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{activity.user_name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{activity.user_id.slice(0, 8)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.activity_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {activity.analyzing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : activity.aiAnalysis ? (
                        <div className="space-y-1">
                          {getRiskBadge(activity.aiAnalysis.risk_level)}
                          <Progress value={activity.aiAnalysis.risk_score} className="h-1 w-20" />
                          <p className="text-xs text-muted-foreground">{activity.aiAnalysis.risk_score}%</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {activity.aiAnalysis?.indicators?.slice(0, 2).map((ind, i) => (
                        <Badge key={i} variant="outline" className="text-xs mr-1">
                          {ind}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      {!activity.aiAnalysis && !activity.analyzing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => analyzeActivity(activity)}
                        >
                          <Bot className="h-3 w-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFraudDetection;
