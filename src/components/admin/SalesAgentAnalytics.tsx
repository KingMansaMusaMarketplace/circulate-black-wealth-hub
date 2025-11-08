import React, { useEffect, useState } from 'react';
import { getAllSalesAgentStats, getAgentPerformanceMetrics, SalesAgentStats, AgentPerformance } from '@/lib/api/admin-analytics-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, Users, DollarSign, Target, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SalesAgentAnalytics: React.FC = () => {
  const [agentStats, setAgentStats] = useState<SalesAgentStats[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<AgentPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [stats, performance] = await Promise.all([
      getAllSalesAgentStats(),
      getAgentPerformanceMetrics()
    ]);
    setAgentStats(stats);
    setPerformanceMetrics(performance);
    setLoading(false);
  };

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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

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
