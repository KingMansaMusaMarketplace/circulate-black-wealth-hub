import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, CheckCircle, XCircle, Eye, RefreshCw, Shield, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface FraudAlert {
  id: string;
  alert_type: string;
  severity: string;
  user_id: string | null;
  business_id: string | null;
  description: string;
  evidence: any;
  status: string;
  ai_confidence_score: number | null;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
}

const AdminFraudAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('fraud_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching fraud alerts:', error);
      toast.error('Failed to fetch fraud alerts');
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string, status: 'resolved' | 'dismissed') => {
    try {
      const { error } = await supabase
        .from('fraud_alerts')
        .update({
          status,
          resolved_at: new Date().toISOString(),
          resolution_notes: resolutionNotes,
        })
        .eq('id', alertId);

      if (error) throw error;

      toast.success(`Alert ${status === 'resolved' ? 'resolved' : 'dismissed'} successfully`);
      setSelectedAlert(null);
      setResolutionNotes('');
      fetchAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'dismissed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const pendingAlerts = alerts.filter(a => a.status === 'pending');
  const criticalAlerts = pendingAlerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  return (
    <div className="space-y-6">
      {/* Critical Alerts Warning */}
      {criticalAlerts.length > 0 && (
        <Card className="backdrop-blur-xl bg-red-500/10 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical/High Priority Alerts ({criticalAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalAlerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <p className="text-white font-medium">{alert.alert_type}</p>
                  </div>
                  <p className="text-blue-300 text-sm mt-1">{alert.description}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAlert(alert)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Fraud Alert Details
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-blue-300 text-sm">Alert Type</p>
                          <p className="text-white">{alert.alert_type}</p>
                        </div>
                        <div>
                          <p className="text-blue-300 text-sm">Severity</p>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-blue-300 text-sm">AI Confidence</p>
                          <p className="text-white">
                            {alert.ai_confidence_score ? `${(alert.ai_confidence_score * 100).toFixed(1)}%` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-300 text-sm">Detected</p>
                          <p className="text-white">{format(new Date(alert.created_at), 'PPp')}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-blue-300 text-sm">Description</p>
                        <p className="text-white bg-white/5 p-3 rounded mt-1">{alert.description}</p>
                      </div>

                      {alert.evidence && (
                        <div>
                          <p className="text-blue-300 text-sm">Evidence</p>
                          <pre className="text-white bg-white/5 p-3 rounded mt-1 text-xs overflow-auto max-h-40">
                            {JSON.stringify(alert.evidence, null, 2)}
                          </pre>
                        </div>
                      )}

                      <div>
                        <label className="text-blue-300 text-sm">Resolution Notes</label>
                        <Textarea
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          placeholder="Add notes about how this alert was resolved..."
                          className="bg-white/5 border-white/10 text-white mt-1"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => resolveAlert(alert.id, 'resolved')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Resolved
                        </Button>
                        <Button
                          onClick={() => resolveAlert(alert.id, 'dismissed')}
                          variant="outline"
                          className="flex-1 border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAlerts} variant="outline" className="border-white/10 text-blue-200 hover:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Alerts */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-400" />
            Fraud Alerts ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                      <span className="text-white font-medium">{alert.alert_type}</span>
                    </div>
                    <p className="text-blue-300 text-sm">{alert.description}</p>
                    <p className="text-blue-400 text-xs mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(alert.created_at), 'PPp')}
                    </p>
                  </div>
                  {alert.status === 'pending' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAlert(alert)}
                          className="border-white/20 text-blue-200 hover:bg-white/10"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-yellow-400">Review Alert</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-blue-300 text-sm">Alert Type</p>
                              <p className="text-white">{alert.alert_type}</p>
                            </div>
                            <div>
                              <p className="text-blue-300 text-sm">Severity</p>
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <p className="text-blue-300 text-sm">Description</p>
                            <p className="text-white bg-white/5 p-3 rounded mt-1">{alert.description}</p>
                          </div>

                          <div>
                            <label className="text-blue-300 text-sm">Resolution Notes</label>
                            <Textarea
                              value={resolutionNotes}
                              onChange={(e) => setResolutionNotes(e.target.value)}
                              placeholder="Add notes..."
                              className="bg-white/5 border-white/10 text-white mt-1"
                            />
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              onClick={() => resolveAlert(alert.id, 'resolved')}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Resolve
                            </Button>
                            <Button
                              onClick={() => resolveAlert(alert.id, 'dismissed')}
                              variant="outline"
                              className="flex-1 border-gray-500/30"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-8 text-green-400 flex items-center justify-center gap-2">
                  <Shield className="h-5 w-5" />
                  No fraud alerts found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFraudAlerts;
