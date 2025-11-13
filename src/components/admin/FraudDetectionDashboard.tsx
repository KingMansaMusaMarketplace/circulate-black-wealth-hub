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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            AI Fraud Detection
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time fraud pattern analysis and alerts
          </p>
        </div>
        <Button 
          onClick={() => runAnalysis()}
          disabled={isRunningAnalysis}
          size="lg"
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertStats.pending}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertStats.critical}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{alertStats.high}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertStats.medium}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertStats.low}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Blocked</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{actionStats.auto_triggered}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prevented</CardTitle>
            <Ban className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {actionStats.qr_disabled + actionStats.accounts_restricted}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List with Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({alertStats.total})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({alertStats.pending})</TabsTrigger>
          <TabsTrigger value="investigating">Investigating</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'investigating', 'confirmed', 'resolved'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filterAlertsByStatus(tab === 'all' ? undefined : tab).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No {tab !== 'all' ? tab : ''} alerts found
                </CardContent>
              </Card>
            ) : (
              filterAlertsByStatus(tab === 'all' ? undefined : tab).map((alert) => (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{alert.description}</CardTitle>
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            {getStatusIcon(alert.status)}
                            {alert.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <CardDescription>
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

                              <Button onClick={handleUpdateStatus} className="w-full">
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

      {/* Prevention Actions */}
      <FraudPreventionActionsTable />
    </div>
  );
};
