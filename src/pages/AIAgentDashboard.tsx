import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bot, Brain, Target, AlertTriangle, TrendingUp, 
  Play, CheckCircle, XCircle, Clock, Zap, Users,
  BarChart3, Shield, MessageSquare, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  runAgentTask, 
  getAgentStats, 
  getAgentActions, 
  getPendingApprovals,
  getLeadScores,
  getChurnPredictions,
  getDealScores,
  reviewAgentAction
} from '@/lib/api/ai-agent-api';
import AgentRulesManager from '@/components/ai-agent/AgentRulesManager';
import { Helmet } from 'react-helmet';

const AIAgentDashboard: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [runningTask, setRunningTask] = useState<string | null>(null);

  // Get user's business
  const { data: business } = useQuery({
    queryKey: ['user-business', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, business_name')
        .eq('owner_id', user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch agent stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['agent-stats', business?.id],
    queryFn: () => getAgentStats(business!.id),
    enabled: !!business?.id
  });

  // Fetch recent actions
  const { data: recentActions } = useQuery({
    queryKey: ['agent-actions', business?.id],
    queryFn: () => getAgentActions(business!.id, undefined, 20),
    enabled: !!business?.id
  });

  // Fetch pending approvals
  const { data: pendingApprovals } = useQuery({
    queryKey: ['agent-pending', business?.id],
    queryFn: () => getPendingApprovals(business!.id),
    enabled: !!business?.id
  });

  // Fetch lead scores
  const { data: leadScores } = useQuery({
    queryKey: ['lead-scores', business?.id],
    queryFn: () => getLeadScores(business!.id),
    enabled: !!business?.id
  });

  // Fetch churn predictions
  const { data: churnPredictions } = useQuery({
    queryKey: ['churn-predictions', business?.id],
    queryFn: () => getChurnPredictions(business!.id),
    enabled: !!business?.id
  });

  // Fetch deal scores
  const { data: dealScores } = useQuery({
    queryKey: ['deal-scores', business?.id],
    queryFn: () => getDealScores(business!.id),
    enabled: !!business?.id
  });

  // Run agent task mutation
  const runTask = useMutation({
    mutationFn: (type: string) => {
      setRunningTask(type);
      return runAgentTask({ type: type as any, businessId: business!.id });
    },
    onSuccess: (data, type) => {
      toast.success(`${type.replace('_', ' ')} completed!`, {
        description: `Analyzed ${data.qualified || data.analyzed || data.scores?.length || 0} items`
      });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
      queryClient.invalidateQueries({ queryKey: ['agent-actions'] });
      queryClient.invalidateQueries({ queryKey: ['lead-scores'] });
      queryClient.invalidateQueries({ queryKey: ['churn-predictions'] });
      queryClient.invalidateQueries({ queryKey: ['deal-scores'] });
    },
    onError: (error) => {
      toast.error('Agent task failed', { description: error.message });
    },
    onSettled: () => {
      setRunningTask(null);
    }
  });

  // Review action mutation
  const reviewAction = useMutation({
    mutationFn: ({ actionId, approved }: { actionId: string; approved: boolean }) =>
      reviewAgentAction(actionId, approved, user!.id),
    onSuccess: (_, { approved }) => {
      toast.success(approved ? 'Action approved' : 'Action rejected');
      queryClient.invalidateQueries({ queryKey: ['agent-pending'] });
      queryClient.invalidateQueries({ queryKey: ['agent-actions'] });
    }
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'executed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!business) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">You need a business to use AI Agent features.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>AI Agent Dashboard | Mansa Musa Marketplace</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              AI Agent Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Autonomous AI that analyzes, decides, and acts on your behalf
            </p>
          </div>
          <Button
            onClick={() => runTask.mutate('full_analysis')}
            disabled={!!runningTask}
            size="lg"
            className="gap-2"
          >
            {runningTask === 'full_analysis' ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Zap className="h-5 w-5" />
            )}
            Run Full Analysis
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Actions</p>
                  <p className="text-3xl font-bold">{stats?.totalActions || 0}</p>
                </div>
                <Brain className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <p className="text-3xl font-bold text-yellow-500">{stats?.pendingApprovals || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Lead Score</p>
                  <p className="text-3xl font-bold text-green-500">{stats?.avgLeadScore || 0}</p>
                </div>
                <Target className="h-8 w-8 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk Customers</p>
                  <p className="text-3xl font-bold text-red-500">{stats?.highRiskCustomers || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-2">
              <Users className="h-4 w-4" />
              Lead Scores
            </TabsTrigger>
            <TabsTrigger value="churn" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Churn Risk
            </TabsTrigger>
            <TabsTrigger value="deals" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Deal Scores
            </TabsTrigger>
            <TabsTrigger value="approvals" className="gap-2">
              <Shield className="h-4 w-4" />
              Approvals
              {(stats?.pendingApprovals || 0) > 0 && (
                <Badge variant="destructive" className="ml-1">{stats?.pendingApprovals}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2">
              <Zap className="h-4 w-4" />
              Rules
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Run individual AI agent tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => runTask.mutate('lead_qualification')}
                    disabled={!!runningTask}
                  >
                    {runningTask === 'lead_qualification' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Target className="h-4 w-4 text-blue-500" />
                    )}
                    Qualify Leads
                    <span className="ml-auto text-muted-foreground text-sm">Score & prioritize customers</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => runTask.mutate('churn_prediction')}
                    disabled={!!runningTask}
                  >
                    {runningTask === 'churn_prediction' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                    Predict Churn
                    <span className="ml-auto text-muted-foreground text-sm">Identify at-risk customers</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => runTask.mutate('deal_scoring')}
                    disabled={!!runningTask}
                  >
                    {runningTask === 'deal_scoring' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                    Score Deals
                    <span className="ml-auto text-muted-foreground text-sm">Predict close probability</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => runTask.mutate('ticket_resolution')}
                    disabled={!!runningTask}
                  >
                    {runningTask === 'ticket_resolution' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-purple-500" />
                    )}
                    Resolve Tickets
                    <span className="ml-auto text-muted-foreground text-sm">Auto-respond to support</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Agent Actions</CardTitle>
                  <CardDescription>Latest autonomous decisions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {recentActions?.slice(0, 10).map((action: any) => (
                      <div key={action.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        {getStatusIcon(action.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {action.action_type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {action.ai_reasoning?.slice(0, 60)}...
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {Math.round((action.ai_confidence || 0) * 100)}%
                        </Badge>
                      </div>
                    ))}
                    {!recentActions?.length && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No actions yet. Run an analysis to get started!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lead Scores Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lead Qualification Scores</CardTitle>
                  <CardDescription>AI-scored leads ranked by potential</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runTask.mutate('lead_qualification')}
                  disabled={!!runningTask}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${runningTask === 'lead_qualification' ? 'animate-spin' : ''}`} />
                  Refresh Scores
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leadScores?.map((score: any) => (
                    <div key={score.id} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{score.customers?.name || 'Unknown'}</h4>
                          <Badge variant="outline">{score.recommended_action}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{score.customers?.email}</p>
                        <p className="text-sm mt-1">{score.ai_reasoning}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold">{score.score}</div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <span>Engagement:</span>
                            <Progress value={score.engagement_score} className="w-16 h-1" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Fit:</span>
                            <Progress value={score.fit_score} className="w-16 h-1" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Intent:</span>
                            <Progress value={score.intent_score} className="w-16 h-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!leadScores?.length && (
                    <p className="text-center text-muted-foreground py-8">
                      No lead scores yet. Click "Refresh Scores" to analyze your customers.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Churn Risk Tab */}
          <TabsContent value="churn">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Churn Risk Predictions</CardTitle>
                  <CardDescription>Customers at risk of leaving</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runTask.mutate('churn_prediction')}
                  disabled={!!runningTask}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${runningTask === 'churn_prediction' ? 'animate-spin' : ''}`} />
                  Analyze Churn
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {churnPredictions?.map((prediction: any) => (
                    <div key={prediction.id} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div className={`w-2 h-12 rounded-full ${getRiskColor(prediction.risk_level)}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{prediction.customers?.name || 'Unknown'}</h4>
                          <Badge className={getRiskColor(prediction.risk_level)}>
                            {prediction.risk_level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          LTV: ${prediction.lifetime_value?.toFixed(2) || 0} | 
                          Inactive: {prediction.days_since_last_activity || 0} days
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {prediction.risk_factors?.map((factor: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-500">
                          {Math.round(prediction.churn_probability * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground">churn risk</p>
                      </div>
                    </div>
                  ))}
                  {!churnPredictions?.length && (
                    <p className="text-center text-muted-foreground py-8">
                      No churn predictions yet. Click "Analyze Churn" to identify at-risk customers.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deal Scores Tab */}
          <TabsContent value="deals">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Deal Probability Scores</CardTitle>
                  <CardDescription>AI predicts which deals will close</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runTask.mutate('deal_scoring')}
                  disabled={!!runningTask}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${runningTask === 'deal_scoring' ? 'animate-spin' : ''}`} />
                  Score Deals
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dealScores?.map((deal: any) => (
                    <div key={deal.id} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium">{deal.deal_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Value: ${deal.deal_value?.toLocaleString() || 0} | 
                          Expected close: {deal.expected_close_date || 'TBD'}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {deal.recommended_next_steps?.slice(0, 3).map((step: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {step}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          deal.close_probability >= 0.7 ? 'text-green-500' :
                          deal.close_probability >= 0.4 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {Math.round(deal.close_probability * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground">close probability</p>
                        <Badge variant="outline" className="mt-1">
                          Risk: {deal.competitor_risk || 'none'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {!dealScores?.length && (
                    <p className="text-center text-muted-foreground py-8">
                      No deal scores yet. Click "Score Deals" to analyze your B2B connections.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review AI decisions before execution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals?.map((action: any) => (
                    <div key={action.id} className="flex items-center gap-4 p-4 rounded-lg border">
                      <Clock className="h-8 w-8 text-yellow-500" />
                      <div className="flex-1">
                        <h4 className="font-medium">{action.action_type.replace(/_/g, ' ')}</h4>
                        <p className="text-sm text-muted-foreground">{action.ai_reasoning}</p>
                        <Badge variant="outline" className="mt-1">
                          Confidence: {Math.round((action.ai_confidence || 0) * 100)}%
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reviewAction.mutate({ actionId: action.id, approved: false })}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => reviewAction.mutate({ actionId: action.id, approved: true })}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!pendingApprovals?.length && (
                    <p className="text-center text-muted-foreground py-8">
                      No pending approvals. All AI actions are either auto-executed or reviewed.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules">
            <AgentRulesManager businessId={business.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAgentDashboard;
