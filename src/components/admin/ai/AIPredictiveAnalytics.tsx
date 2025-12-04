import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Brain, Loader2, TrendingUp, TrendingDown, User, Building2, AlertTriangle } from 'lucide-react';

interface Prediction {
  id: string;
  name: string;
  type: 'user' | 'business';
  churn_risk: string;
  churn_probability: number;
  engagement_trend: string;
  success_likelihood: number;
  key_factors: string[];
  retention_suggestions: string[];
}

const AIPredictiveAnalytics: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState<Set<string>>(new Set());

  const [users, setUsers] = useState<Array<{ id: string; full_name: string; email: string; created_at: string }>>([]);
  const [businesses, setBusinesses] = useState<Array<{ id: string; business_name: string; created_at: string; subscription_status: string }>>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, businessesRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, created_at').limit(20),
        supabase.from('businesses').select('id, business_name, created_at, subscription_status').limit(20),
      ]);

      setUsers(usersRes.data || []);
      setBusinesses(businessesRes.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const analyzePrediction = async (item: { id: string; name: string; type: 'user' | 'business'; data: Record<string, unknown> }) => {
    setAnalyzing(prev => new Set(prev).add(item.id));

    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-assistant', {
        body: {
          type: 'predictive_analytics',
          data: item.data,
        },
      });

      if (error) throw error;

      let parsed;
      try {
        const jsonMatch = data.result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        parsed = {
          churn_risk: 'medium',
          churn_probability: 50,
          engagement_trend: 'stable',
          success_likelihood: 50,
          key_factors: [],
          retention_suggestions: [data.result],
        };
      }

      const prediction: Prediction = {
        id: item.id,
        name: item.name,
        type: item.type,
        ...parsed,
      };

      setPredictions(prev => {
        const existing = prev.findIndex(p => p.id === item.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = prediction;
          return updated;
        }
        return [...prev, prediction];
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate prediction');
    } finally {
      setAnalyzing(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const analyzeAllUsers = async () => {
    setLoading(true);
    for (const user of users.slice(0, 5)) {
      await analyzePrediction({
        id: user.id,
        name: user.full_name || user.email || 'Unknown',
        type: 'user',
        data: { ...user, entityType: 'user' },
      });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setLoading(false);
    toast.success('User predictions complete');
  };

  const analyzeAllBusinesses = async () => {
    setLoading(true);
    for (const business of businesses.slice(0, 5)) {
      await analyzePrediction({
        id: business.id,
        name: business.business_name,
        type: 'business',
        data: { ...business, entityType: 'business' },
      });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setLoading(false);
    toast.success('Business predictions complete');
  };

  const getChurnBadge = (risk: string, probability: number) => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive">{probability}% Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">{probability}% Risk</Badge>;
      default:
        return <Badge variant="secondary">{probability}% Risk</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <span className="text-muted-foreground">—</span>;
    }
  };

  const userPredictions = predictions.filter(p => p.type === 'user');
  const businessPredictions = predictions.filter(p => p.type === 'business');

  const highRiskCount = predictions.filter(p => p.churn_risk === 'high').length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Predictions Generated</p>
                <p className="text-2xl font-bold">{predictions.length}</p>
              </div>
              <Brain className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Churn Risk</p>
                <p className="text-2xl font-bold text-red-500">{highRiskCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Success Score</p>
                <p className="text-2xl font-bold text-green-500">
                  {predictions.length > 0 
                    ? Math.round(predictions.reduce((sum, p) => sum + p.success_likelihood, 0) / predictions.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Predictive Analytics
          </CardTitle>
          <CardDescription>
            Churn prediction and engagement forecasting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Users ({userPredictions.length})
                </TabsTrigger>
                <TabsTrigger value="businesses" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Businesses ({businessPredictions.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="users">
              <div className="mb-4">
                <Button onClick={analyzeAllUsers} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Brain className="h-4 w-4 mr-2" />}
                  Analyze Top Users
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Churn Risk</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Key Factors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPredictions.map((prediction) => (
                    <TableRow key={prediction.id}>
                      <TableCell className="font-medium">{prediction.name}</TableCell>
                      <TableCell>{getChurnBadge(prediction.churn_risk, prediction.churn_probability)}</TableCell>
                      <TableCell>{getTrendIcon(prediction.engagement_trend)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={prediction.success_likelihood} className="w-16 h-2" />
                          <span className="text-xs">{prediction.success_likelihood}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {prediction.key_factors.slice(0, 2).map((factor, i) => (
                          <Badge key={i} variant="outline" className="text-xs mr-1">{factor}</Badge>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                  {userPredictions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No user predictions yet. Click "Analyze Top Users" to generate.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="businesses">
              <div className="mb-4">
                <Button onClick={analyzeAllBusinesses} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Brain className="h-4 w-4 mr-2" />}
                  Analyze Top Businesses
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Churn Risk</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Key Factors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessPredictions.map((prediction) => (
                    <TableRow key={prediction.id}>
                      <TableCell className="font-medium">{prediction.name}</TableCell>
                      <TableCell>{getChurnBadge(prediction.churn_risk, prediction.churn_probability)}</TableCell>
                      <TableCell>{getTrendIcon(prediction.engagement_trend)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={prediction.success_likelihood} className="w-16 h-2" />
                          <span className="text-xs">{prediction.success_likelihood}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {prediction.key_factors.slice(0, 2).map((factor, i) => (
                          <Badge key={i} variant="outline" className="text-xs mr-1">{factor}</Badge>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                  {businessPredictions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No business predictions yet. Click "Analyze Top Businesses" to generate.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPredictiveAnalytics;
