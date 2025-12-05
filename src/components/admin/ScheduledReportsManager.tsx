import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, Mail, Clock, Trash2, Play, Pause } from 'lucide-react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ScheduledReport {
  id: string;
  report_name: string;
  report_type: string;
  frequency: string;
  recipients: string[];
  next_run_at: string;
  last_run_at: string | null;
  is_active: boolean;
  config: Record<string, any>;
  created_by: string | null;
  created_at: string;
}

const reportTypes = [
  { value: 'user_signups', label: 'User Signups', description: 'New user registrations' },
  { value: 'business_performance', label: 'Business Performance', description: 'Business metrics and KPIs' },
  { value: 'agent_commissions', label: 'Agent Commissions', description: 'Sales agent earnings' },
  { value: 'revenue', label: 'Revenue Report', description: 'Platform revenue summary' },
  { value: 'retention', label: 'Retention Report', description: 'User retention metrics' },
  { value: 'activity', label: 'Activity Summary', description: 'Platform activity overview' }
];

const ScheduledReportsManager: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    report_name: '',
    report_type: '',
    frequency: 'weekly',
    recipients: ''
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ['scheduled-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_reports')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ScheduledReport[];
    }
  });

  const calculateNextRun = (frequency: string) => {
    const now = new Date();
    now.setHours(9, 0, 0, 0); // Default to 9 AM
    
    switch (frequency) {
      case 'daily':
        return addDays(now, 1);
      case 'weekly':
        return addWeeks(now, 1);
      case 'monthly':
        return addMonths(now, 1);
      default:
        return addWeeks(now, 1);
    }
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const recipients = formData.recipients.split(',').map(e => e.trim()).filter(Boolean);
      
      const { error } = await supabase
        .from('scheduled_reports')
        .insert({
          report_name: formData.report_name,
          report_type: formData.report_type,
          frequency: formData.frequency,
          recipients,
          next_run_at: calculateNextRun(formData.frequency).toISOString(),
          created_by: user?.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports'] });
      setIsCreateOpen(false);
      resetForm();
      toast.success('Scheduled report created!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create report');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ScheduledReport> }) => {
      const { error } = await supabase
        .from('scheduled_reports')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports'] });
      toast.success('Report updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scheduled_reports')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports'] });
      toast.success('Report deleted');
    }
  });

  const resetForm = () => {
    setFormData({
      report_name: '',
      report_type: '',
      frequency: 'weekly',
      recipients: ''
    });
  };

  const getFrequencyBadge = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-blue-500/20 text-blue-400';
      case 'weekly': return 'bg-green-500/20 text-green-400';
      case 'monthly': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-white/20 text-white';
    }
  };

  const stats = {
    total: reports?.length || 0,
    active: reports?.filter(r => r.is_active).length || 0,
    daily: reports?.filter(r => r.frequency === 'daily' && r.is_active).length || 0,
    weekly: reports?.filter(r => r.frequency === 'weekly' && r.is_active).length || 0
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-mansagold/10 border-mansagold/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-mansagold" />
              <div>
                <p className="text-white/60 text-sm">Total Reports</p>
                <p className="text-2xl font-bold text-mansagold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-white/60 text-sm">Active</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-white/60 text-sm">Daily</p>
                <p className="text-2xl font-bold text-blue-400">{stats.daily}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-white/60 text-sm">Weekly</p>
                <p className="text-2xl font-bold text-purple-400">{stats.weekly}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-mansagold" />
              Scheduled Reports
            </CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-mansagold hover:bg-mansagold/90 text-mansablue-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-mansablue-dark border-white/20">
                <DialogHeader>
                  <DialogTitle className="text-white">Schedule New Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/80">Report Name</Label>
                    <Input
                      value={formData.report_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, report_name: e.target.value }))}
                      placeholder="Weekly Performance Summary"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/80">Report Type</Label>
                    <Select
                      value={formData.report_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, report_type: value }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <p>{type.label}</p>
                              <p className="text-xs text-muted-foreground">{type.description}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/80">Frequency</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/80">Recipients (comma-separated emails)</Label>
                    <Input
                      value={formData.recipients}
                      onChange={(e) => setFormData(prev => ({ ...prev, recipients: e.target.value }))}
                      placeholder="admin@example.com, manager@example.com"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <Button
                    onClick={() => createMutation.mutate()}
                    disabled={!formData.report_name || !formData.report_type || !formData.recipients || createMutation.isPending}
                    className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue-dark"
                  >
                    Schedule Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansagold"></div>
              </div>
            ) : reports && reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-medium">{report.report_name}</p>
                          <Badge className={report.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {report.is_active ? 'Active' : 'Paused'}
                          </Badge>
                          <Badge className={getFrequencyBadge(report.frequency)}>
                            {report.frequency}
                          </Badge>
                        </div>
                        <p className="text-white/60 text-sm">
                          {reportTypes.find(t => t.value === report.report_type)?.label || report.report_type}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-white/40 text-xs">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {report.recipients.length} recipient{report.recipients.length > 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Next: {format(new Date(report.next_run_at), 'MMM d, h:mm a')}
                          </span>
                          {report.last_run_at && (
                            <span>Last: {format(new Date(report.last_run_at), 'MMM d')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={report.is_active}
                          onCheckedChange={(checked) => updateMutation.mutate({ 
                            id: report.id, 
                            updates: { is_active: checked }
                          })}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(report.id)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-white/60">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No scheduled reports yet</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduledReportsManager;
