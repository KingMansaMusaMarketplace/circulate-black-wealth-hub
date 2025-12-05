import React, { useEffect, useState } from 'react';
import { getAllSalesAgentStats, getAgentPerformanceMetrics, SalesAgentStats, AgentPerformance } from '@/lib/api/admin-analytics-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, TrendingUp, Users, DollarSign, Target, Award, Clock, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Application {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  application_status: string;
  test_score: number | null;
  test_passed: boolean | null;
  application_date: string;
  why_join: string | null;
  business_experience: string | null;
  marketing_ideas: string | null;
  notes: string | null;
}

const SalesAgentAnalytics: React.FC = () => {
  const [agentStats, setAgentStats] = useState<SalesAgentStats[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<AgentPerformance[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [stats, performance] = await Promise.all([
      getAllSalesAgentStats(),
      getAgentPerformanceMetrics()
    ]);
    
    // Fetch applications
    const { data: appsData } = await supabase
      .from('sales_agent_applications')
      .select('*')
      .order('application_date', { ascending: false });
    
    setAgentStats(stats);
    setPerformanceMetrics(performance);
    setApplications(appsData || []);
    setLoading(false);
  };

  const handleApplicationReview = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('sales_agent_applications')
        .update({
          application_status: status,
          notes: reviewNotes,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', applicationId);

      if (error) throw error;

      if (status === 'approved') {
        const application = applications.find(a => a.id === applicationId);
        if (application) {
          const referralCode = `AGENT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          
          const { error: agentError } = await supabase
            .from('sales_agents')
            .insert({
              user_id: application.user_id,
              full_name: application.full_name,
              email: application.email,
              phone: application.phone,
              referral_code: referralCode,
              commission_rate: 10.0,
              tier: 'bronze',
              is_active: true,
            });

          if (agentError) throw agentError;

          await supabase.rpc('secure_change_user_role', {
            target_user_id: application.user_id,
            new_role: 'sales_agent',
            reason: 'Application approved'
          });
        }
      }

      toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      setReviewNotes('');
      loadData();
    } catch (error) {
      console.error('Error reviewing application:', error);
      toast.error('Failed to review application');
    }
  };

  const pendingApplications = applications.filter(a => a.application_status === 'pending');

  const totalAgents = agentStats.length;
  const activeAgents = agentStats.filter(a => a.is_active).length;
  const totalReferrals = agentStats.reduce((sum, a) => sum + a.total_referrals, 0);
  const totalEarned = agentStats.reduce((sum, a) => sum + a.total_earned, 0);
  const totalPending = agentStats.reduce((sum, a) => sum + a.total_pending, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-mansablue">Sales Agent Analytics</h2>
          <p className="text-muted-foreground">Monitor agent performance and earnings</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground">
              {activeAgents} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              Across all agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarned.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Paid commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              To be paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Agent</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalAgents > 0 ? (totalEarned / totalAgents).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Earnings average
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications" className="relative">
            Applications
            {pendingApplications.length > 0 && (
              <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                {pendingApplications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Pending Applications ({pendingApplications.length})
              </CardTitle>
              <CardDescription>Review and approve sales agent applications</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApplications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pending applications</p>
              ) : (
                <div className="space-y-3">
                  {pendingApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{application.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {application.email} {application.phone && `• ${application.phone}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Applied: {format(new Date(application.application_date), 'MMM d, yyyy')}
                          {application.test_passed !== null && (
                            <span className={application.test_passed ? ' • Test Passed' : ' • Test Failed'}>
                              {application.test_score !== null && ` (${application.test_score}%)`}
                            </span>
                          )}
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Application</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Full Name</p>
                                <p className="font-medium">{application.full_name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p>{application.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p>{application.phone || 'Not provided'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Test Status</p>
                                <Badge variant={application.test_passed ? 'default' : 'secondary'}>
                                  {application.test_passed ? `Passed (${application.test_score}%)` : application.test_passed === false ? 'Failed' : 'Pending'}
                                </Badge>
                              </div>
                            </div>

                            {application.why_join && (
                              <div>
                                <p className="text-sm text-muted-foreground">Why they want to join</p>
                                <p className="bg-muted p-3 rounded mt-1">{application.why_join}</p>
                              </div>
                            )}

                            {application.business_experience && (
                              <div>
                                <p className="text-sm text-muted-foreground">Business Experience</p>
                                <p className="bg-muted p-3 rounded mt-1">{application.business_experience}</p>
                              </div>
                            )}

                            {application.marketing_ideas && (
                              <div>
                                <p className="text-sm text-muted-foreground">Marketing Ideas</p>
                                <p className="bg-muted p-3 rounded mt-1">{application.marketing_ideas}</p>
                              </div>
                            )}

                            <div>
                              <label className="text-sm text-muted-foreground">Review Notes</label>
                              <Textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Add notes about this application..."
                                className="mt-1"
                              />
                            </div>

                            <div className="flex gap-3 pt-4">
                              <Button
                                onClick={() => handleApplicationReview(application.id, 'approved')}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleApplicationReview(application.id, 'rejected')}
                                variant="destructive"
                                className="flex-1"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Sales Agents</CardTitle>
              <CardDescription>Complete list of sales agents and their stats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Referral Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Referrals</TableHead>
                      <TableHead className="text-right">Active</TableHead>
                      <TableHead className="text-right">Conv. Rate</TableHead>
                      <TableHead className="text-right">Earned</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentStats.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{agent.full_name}</div>
                            <div className="text-sm text-muted-foreground">{agent.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{agent.referral_code}</TableCell>
                        <TableCell>
                          <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                            {agent.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{agent.total_referrals}</TableCell>
                        <TableCell className="text-right">{agent.active_referrals}</TableCell>
                        <TableCell className="text-right">{agent.conversion_rate.toFixed(1)}%</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          ${agent.total_earned.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-yellow-600">
                          ${agent.total_pending.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Metrics</CardTitle>
              <CardDescription>Detailed performance including QR codes and recruitment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead className="text-right">QR Scans</TableHead>
                      <TableHead className="text-right">Conversions</TableHead>
                      <TableHead className="text-right">Conv. %</TableHead>
                      <TableHead className="text-right">Recruited</TableHead>
                      <TableHead className="text-right">Team $</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceMetrics.map((metric) => (
                      <TableRow key={metric.agent_id}>
                        <TableCell className="font-medium">{metric.agent_name}</TableCell>
                        <TableCell className="font-mono text-sm">{metric.referral_code}</TableCell>
                        <TableCell className="text-right">{metric.total_scans}</TableCell>
                        <TableCell className="text-right">{metric.total_conversions}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={metric.conversion_rate >= 50 ? 'default' : 'secondary'}>
                            {metric.conversion_rate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{metric.recruited_agents}</TableCell>
                        <TableCell className="text-right">${metric.team_earnings.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-green-600">
                          ${metric.paid_commissions.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-yellow-600">
                          ${metric.pending_commissions.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesAgentAnalytics;
