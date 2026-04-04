import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Activity, CheckCircle, XCircle, Clock, RefreshCw,
  ChevronDown, ChevronRight, AlertTriangle, Loader2, Timer
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface ExecutionDashboardProps {
  businessId: string;
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  completed: { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/20' },
  running: { icon: Loader2, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  pending: { icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  failed: { icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-500/20' },
  skipped: { icon: AlertTriangle, color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
};

export const WorkflowExecutionDashboard: React.FC<ExecutionDashboardProps> = ({ businessId }) => {
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);

  // Fetch recent executions across all workflows for this business
  const { data: executions, isLoading, refetch } = useQuery({
    queryKey: ['workflow-executions', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_executions')
        .select(`
          *,
          workflow:workflows!workflow_executions_workflow_id_fkey(id, name, trigger_type)
        `)
        .eq('workflow.business_id', businessId)
        .order('executed_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    refetchInterval: 15000,
  });

  // Fetch steps for expanded execution
  const { data: steps } = useQuery({
    queryKey: ['execution-steps', expandedExecution],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_execution_steps')
        .select(`
          *,
          action:workflow_actions!workflow_execution_steps_action_id_fkey(action_type, action_config, is_condition)
        `)
        .eq('execution_id', expandedExecution!)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!expandedExecution,
  });

  // Fetch pending schedules
  const { data: pendingSchedules } = useQuery({
    queryKey: ['workflow-schedules', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflow_schedules')
        .select(`
          *,
          execution:workflow_executions!workflow_schedules_execution_id_fkey(
            workflow:workflows!workflow_executions_workflow_id_fkey(name)
          )
        `)
        .eq('status', 'pending')
        .order('scheduled_for', { ascending: true })
        .limit(20);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  // Stats
  const stats = {
    total: executions?.length || 0,
    completed: executions?.filter(e => e.status === 'completed').length || 0,
    failed: executions?.filter(e => e.status === 'failed').length || 0,
    running: executions?.filter(e => e.status === 'running' || e.status === 'pending').length || 0,
  };

  const getStatusConfig = (status: string) => STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  const getDuration = (start: string, end: string | null) => {
    if (!end) return 'In progress...';
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Runs', value: stats.total, icon: Activity, color: 'blue' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green' },
          { label: 'Failed', value: stats.failed, icon: XCircle, color: 'red' },
          { label: 'In Progress', value: stats.running, icon: Loader2, color: 'yellow' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className={`bg-${color}-500/5 border-${color}-500/20`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${color}-500/20`}>
                <Icon className={`h-5 w-5 text-${color}-400`} />
              </div>
              <div>
                <p className={`text-xs text-${color}-300/70`}>{label}</p>
                <p className={`text-xl font-bold text-${color}-400`}>{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Schedules */}
      {pendingSchedules && pendingSchedules.length > 0 && (
        <Card className="bg-yellow-500/5 border-yellow-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-400 text-sm flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Scheduled Actions ({pendingSchedules.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {pendingSchedules.map((schedule: any) => (
                <div key={schedule.id} className="flex items-center justify-between p-2 bg-white/5 rounded text-sm">
                  <span className="text-blue-200">
                    {(schedule as any).execution?.workflow?.name || 'Unknown workflow'}
                  </span>
                  <span className="text-yellow-400/80 text-xs">
                    Runs {formatDistanceToNow(new Date(schedule.scheduled_for), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Execution List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Execution History</CardTitle>
              <CardDescription className="text-blue-200/70">
                Recent workflow runs with step-by-step details
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-blue-200 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
          ) : !executions?.length ? (
            <div className="text-center py-12 text-blue-200/60">
              <Activity className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No executions yet. Trigger a workflow to see results here.</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {executions.map((execution: any) => {
                  const config = getStatusConfig(execution.status);
                  const StatusIcon = config.icon;
                  const isExpanded = expandedExecution === execution.id;

                  return (
                    <Collapsible
                      key={execution.id}
                      open={isExpanded}
                      onOpenChange={() => setExpandedExecution(isExpanded ? null : execution.id)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded ${config.bgColor}`}>
                              <StatusIcon className={`h-4 w-4 ${config.color} ${execution.status === 'running' ? 'animate-spin' : ''}`} />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-white">
                                {execution.workflow?.name || 'Unknown Workflow'}
                              </p>
                              <p className="text-xs text-blue-200/60">
                                {formatDistanceToNow(new Date(execution.executed_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`${config.bgColor} ${config.color} border-0 text-xs`}>
                              {execution.status}
                            </Badge>
                            <span className="text-xs text-blue-200/50">
                              {getDuration(execution.executed_at, execution.completed_at)}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-blue-200/40" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-blue-200/40" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="ml-6 mt-1 p-3 bg-white/[0.02] rounded-lg border-l-2 border-white/10 space-y-2">
                          {/* Error Message */}
                          {execution.error_message && (
                            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-300">
                              <strong>Error:</strong> {execution.error_message}
                            </div>
                          )}

                          {/* Trigger Data */}
                          {execution.trigger_data && (
                            <div className="text-xs">
                              <p className="text-blue-200/50 mb-1">Trigger Data:</p>
                              <pre className="bg-white/5 p-2 rounded text-blue-200/80 overflow-x-auto">
                                {JSON.stringify(execution.trigger_data, null, 2)}
                              </pre>
                            </div>
                          )}

                          {/* Steps */}
                          {isExpanded && steps && steps.length > 0 && (
                            <div className="space-y-1.5 mt-2">
                              <p className="text-xs text-blue-200/50">Steps:</p>
                              {steps.map((step: any, idx: number) => {
                                const stepConfig = getStatusConfig(step.status);
                                const StepIcon = stepConfig.icon;
                                return (
                                  <div
                                    key={step.id}
                                    className="flex items-start gap-2 p-2 bg-white/5 rounded text-xs"
                                  >
                                    <StepIcon className={`h-3.5 w-3.5 mt-0.5 ${stepConfig.color} flex-shrink-0`} />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <span className="text-white font-medium">
                                          Step {idx + 1}: {step.action?.action_type || 'Unknown'}
                                          {step.action?.is_condition && ' (Condition)'}
                                        </span>
                                        <span className="text-blue-200/50">
                                          {getDuration(step.started_at || step.created_at, step.completed_at)}
                                        </span>
                                      </div>
                                      {step.error_message && (
                                        <p className="text-red-300 mt-1">{step.error_message}</p>
                                      )}
                                      {step.output_data && (
                                        <pre className="text-blue-200/60 mt-1 overflow-x-auto">
                                          {JSON.stringify(step.output_data, null, 2)}
                                        </pre>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {isExpanded && (!steps || steps.length === 0) && (
                            <p className="text-xs text-blue-200/40 italic">No step details available</p>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
