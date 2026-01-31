import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, Plus, Play, Pause, Trash2, Settings, 
  ChevronRight, Activity, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getWorkflows, toggleWorkflow, deleteWorkflow,
  Workflow, TRIGGER_TYPE_LABELS
} from '@/lib/api/workflow-api';
import { WorkflowEditor } from '@/components/workflows/WorkflowEditor';

export default function WorkflowBuilderPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Get business ID for the current user
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

  const { data: workflows, isLoading } = useQuery({
    queryKey: ['workflows', business?.id],
    queryFn: () => getWorkflows(business!.id),
    enabled: !!business?.id
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      toggleWorkflow(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setSelectedWorkflow(null);
    }
  });

  const activeWorkflows = workflows?.filter(w => w.is_active) || [];
  const inactiveWorkflows = workflows?.filter(w => !w.is_active) || [];

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 p-8 text-center">
          <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Business Required</h2>
          <p className="text-blue-200">You need a business account to create workflows.</p>
        </Card>
      </div>
    );
  }

  if (selectedWorkflow || isCreating) {
    return (
      <WorkflowEditor
        workflow={selectedWorkflow}
        businessId={business.id}
        onClose={() => {
          setSelectedWorkflow(null);
          setIsCreating(false);
        }}
        onSave={() => {
          queryClient.invalidateQueries({ queryKey: ['workflows'] });
          setSelectedWorkflow(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-400" />
              Workflow Automation
            </h1>
            <p className="text-blue-200 mt-1">Create automated actions triggered by customer events</p>
          </div>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Play className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-green-300/70">Active</p>
                <p className="text-2xl font-bold text-green-400">{activeWorkflows.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border-gray-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-gray-500/20 rounded-lg">
                <Pause className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-300/70">Paused</p>
                <p className="text-2xl font-bold text-gray-400">{inactiveWorkflows.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-blue-300/70">Total Workflows</p>
                <p className="text-2xl font-bold text-blue-400">{workflows?.length || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-purple-300/70">Total Actions</p>
                <p className="text-2xl font-bold text-purple-400">
                  {workflows?.reduce((sum, w) => sum + (w.actions?.length || 0), 0) || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow List */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Your Workflows</CardTitle>
            <CardDescription className="text-blue-200/70">
              Click on a workflow to edit its configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400" />
              </div>
            ) : workflows?.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="h-12 w-12 text-yellow-400/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No workflows yet</h3>
                <p className="text-blue-200/70 mb-4">Create your first automation to get started</p>
                <Button 
                  onClick={() => setIsCreating(true)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {workflows?.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="group p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${workflow.is_active ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                            {workflow.is_active ? (
                              <Play className="h-5 w-5 text-green-400" />
                            ) : (
                              <Pause className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-white group-hover:text-yellow-400 transition-colors">
                              {workflow.name}
                            </h4>
                            <p className="text-sm text-blue-200/70">
                              {TRIGGER_TYPE_LABELS[workflow.trigger_type]}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge className={workflow.is_active 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }>
                            {workflow.is_active ? 'Active' : 'Paused'}
                          </Badge>
                          <Badge variant="outline" className="text-blue-200/70">
                            {workflow.actions?.length || 0} actions
                          </Badge>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-blue-200 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMutation.mutate({ 
                                  id: workflow.id, 
                                  isActive: !workflow.is_active 
                                });
                              }}
                            >
                              {workflow.is_active ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-400 hover:text-red-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Delete this workflow?')) {
                                  deleteMutation.mutate(workflow.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <ChevronRight className="h-5 w-5 text-blue-200/40 group-hover:text-yellow-400 transition-colors" />
                        </div>
                      </div>

                      {workflow.description && (
                        <p className="text-sm text-blue-200/60 mt-2 ml-14">
                          {workflow.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
