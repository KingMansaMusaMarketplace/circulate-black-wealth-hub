import { useState } from 'react';
import { useFraudDetection, FraudAlert } from '@/hooks/use-fraud-detection';
import { useFraudPrevention } from '@/hooks/use-fraud-prevention';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, Eye, Loader2, Play, ShieldCheck, Ban } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { FraudPreventionActionsTable } from './FraudPreventionActionsTable';

export const FraudDetectionDashboard = () => {
  const { alerts, alertStats, isLoading, isRunningAnalysis, runAnalysis, updateAlertStatus } = useFraudDetection();
  const { actionStats } = useFraudPrevention();
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [newStatus, setNewStatus] = useState<FraudAlert['status']>('investigating');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'investigating': return <Eye className="h-4 w-4" />;
      case 'confirmed': return <AlertTriangle className="h-4 w-4" />;
      case 'false_positive': return <XCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleUpdateStatus = () => {
    if (!selectedAlert) return;
    
    updateAlertStatus({
      alertId: selectedAlert.id,
      status: newStatus,
      resolutionNotes: resolutionNotes
    });
    
    setSelectedAlert(null);
    setResolutionNotes('');
  };

  const filterAlertsByStatus = (status?: string) => {
    if (!status || status === 'all') return alerts;
    return alerts.filter(alert => alert.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Run Analysis Button */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Fraud Analysis</h2>
          <p className="text-white/70">Monitor and investigate suspicious activity</p>
        </div>
        <Button 
          onClick={() => runAnalysis()}
          disabled={isRunningAnalysis}
          size="lg"
          className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold"
        >
          {isRunningAnalysis ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Analysis
            </>
          )}
        </Button>
      </div>

      {/* Alert Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Alerts</CardTitle>
            <Shield className="h-4 w-4 text-mansagold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{alertStats.total}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{alertStats.pending}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-red-500/20 border border-red-400/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{alertStats.critical}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-orange-500/20 border border-orange-400/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">High</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{alertStats.high}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Medium</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{alertStats.medium}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Low</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{alertStats.low}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-400/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Auto-Blocked</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{actionStats.auto_triggered}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-green-500/20 border border-green-400/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Prevented</CardTitle>
            <Ban className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {actionStats.qr_disabled + actionStats.accounts_restricted}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List with Tabs */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white/10 border border-white/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70">
              All ({alertStats.total})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70">
              Pending ({alertStats.pending})
            </TabsTrigger>
            <TabsTrigger value="investigating" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70">
              Investigating
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70">
              Confirmed
            </TabsTrigger>
            <TabsTrigger value="resolved" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70">
              Resolved
            </TabsTrigger>
          </TabsList>

          {['all', 'pending', 'investigating', 'confirmed', 'resolved'].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
              {filterAlertsByStatus(tab === 'all' ? undefined : tab).length === 0 ? (
                <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
                  <CardContent className="pt-6 text-center text-white/60">
                    No {tab !== 'all' ? tab : ''} alerts found
                  </CardContent>
                </Card>
              ) : (
                filterAlertsByStatus(tab === 'all' ? undefined : tab).map((alert) => (
                  <Card key={alert.id} className="backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-lg text-white">{alert.description}</CardTitle>
                            <Badge variant={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="gap-1 border-white/30 text-white/80">
                              {getStatusIcon(alert.status)}
                              {alert.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <CardDescription className="text-white/60">
                            {alert.alert_type.replace('_', ' ').toUpperCase()} • 
                            AI Confidence: {(alert.ai_confidence_score * 100).toFixed(0)}% • 
                            {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                          </CardDescription>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedAlert(alert)}
                              className="border-mansagold/50 text-mansagold hover:bg-mansagold/20"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Fraud Alert Details</DialogTitle>
                              <DialogDescription>{alert.description}</DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Evidence</h4>
                                <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-60">
                                  {JSON.stringify(alert.evidence, null, 2)}
                                </pre>
                              </div>

                              {alert.resolution_notes && (
                                <div>
                                  <h4 className="font-semibold mb-2">Resolution Notes</h4>
                                  <p className="text-sm text-muted-foreground">{alert.resolution_notes}</p>
                                </div>
                              )}

                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Update Status</label>
                                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as FraudAlert['status'])}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="investigating">Investigating</SelectItem>
                                      <SelectItem value="confirmed">Confirmed</SelectItem>
                                      <SelectItem value="false_positive">False Positive</SelectItem>
                                      <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <label className="text-sm font-medium mb-2 block">Resolution Notes</label>
                                  <Textarea
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                    placeholder="Add notes about investigation or resolution..."
                                    rows={3}
                                  />
                                </div>

                                <Button onClick={handleUpdateStatus} className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue">
                                  Update Alert
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Prevention Actions */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
        <FraudPreventionActionsTable />
      </div>
    </div>
  );
};
