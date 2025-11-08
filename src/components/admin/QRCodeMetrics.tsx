import React, { useEffect, useState } from 'react';
import { getQRCodeMetrics, QRCodeMetrics as QRMetrics } from '@/lib/api/admin-analytics-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, QrCode, Target, TrendingUp, Calendar, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const QRCodeMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<QRMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    const data = await getQRCodeMetrics();
    setMetrics(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load QR code metrics
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-mansablue">QR Code Analytics</h2>
          <p className="text-muted-foreground">Track QR code scans and conversion performance</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_scans}</div>
            <p className="text-xs text-muted-foreground">
              All-time scans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_conversions}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.overall_conversion_rate.toFixed(1)}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.scans_today}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.conversions_today} conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.scans_this_week}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.conversions_this_week} conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.scans_this_month}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.conversions_this_month} conversions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rate Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Conversion Performance</CardTitle>
          <CardDescription>QR code scan to signup conversion tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Conversion Rate</span>
              <span className="text-sm font-medium">{metrics.overall_conversion_rate.toFixed(2)}%</span>
            </div>
            <Progress value={metrics.overall_conversion_rate} className="h-3" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 pt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Today's Conversion</p>
              <div className="flex items-center gap-2">
                <Progress 
                  value={metrics.scans_today > 0 ? (metrics.conversions_today / metrics.scans_today) * 100 : 0} 
                  className="h-2 flex-1" 
                />
                <span className="text-xs font-medium">
                  {metrics.scans_today > 0 
                    ? ((metrics.conversions_today / metrics.scans_today) * 100).toFixed(1) 
                    : '0.0'}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Week's Conversion</p>
              <div className="flex items-center gap-2">
                <Progress 
                  value={metrics.scans_this_week > 0 ? (metrics.conversions_this_week / metrics.scans_this_week) * 100 : 0} 
                  className="h-2 flex-1" 
                />
                <span className="text-xs font-medium">
                  {metrics.scans_this_week > 0 
                    ? ((metrics.conversions_this_week / metrics.scans_this_week) * 100).toFixed(1) 
                    : '0.0'}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Month's Conversion</p>
              <div className="flex items-center gap-2">
                <Progress 
                  value={metrics.scans_this_month > 0 ? (metrics.conversions_this_month / metrics.scans_this_month) * 100 : 0} 
                  className="h-2 flex-1" 
                />
                <span className="text-xs font-medium">
                  {metrics.scans_this_month > 0 
                    ? ((metrics.conversions_this_month / metrics.scans_this_month) * 100).toFixed(1) 
                    : '0.0'}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Agents</CardTitle>
          <CardDescription>Agents with highest QR code conversion rates</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.top_performing_agents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No QR code scan data available yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead className="text-right">Total Scans</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                    <TableHead className="text-right">Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.top_performing_agents.map((agent, index) => (
                    <TableRow key={agent.referral_code}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
                          {index === 1 && <Award className="h-4 w-4 text-gray-400" />}
                          {index === 2 && <Award className="h-4 w-4 text-orange-600" />}
                          <span className="font-medium">{agent.agent_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{agent.referral_code}</TableCell>
                      <TableCell className="text-right">{agent.scans}</TableCell>
                      <TableCell className="text-right font-medium">{agent.conversions}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={agent.conversion_rate >= 50 ? 'default' : agent.conversion_rate >= 25 ? 'secondary' : 'outline'}
                        >
                          {agent.conversion_rate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeMetrics;
