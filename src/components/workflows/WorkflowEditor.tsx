import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Zap, Plus, Trash2, Save, 
  ChevronDown, ChevronUp, GripVertical
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Workflow, WorkflowAction, WorkflowTriggerType, WorkflowActionType,
  createWorkflow, updateWorkflow, addWorkflowAction, deleteWorkflowAction,
  TRIGGER_TYPE_LABELS, ACTION_TYPE_LABELS
} from '@/lib/api/workflow-api';
import { TriggerSelector } from './TriggerSelector';
import { ActionBuilder } from './ActionBuilder';

interface WorkflowEditorProps {
  workflow: Workflow | null;
  businessId: string;
  onClose: () => void;
  onSave: () => void;
}

export const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  workflow,
  businessId,
  onClose,
  onSave
}) => {
  const isEditing = !!workflow;
  
  const [name, setName] = useState(workflow?.name || '');
  const [description, setDescription] = useState(workflow?.description || '');
  const [isActive, setIsActive] = useState(workflow?.is_active ?? true);
  const [triggerType, setTriggerType] = useState<WorkflowTriggerType>(
    workflow?.trigger_type || 'purchase'
  );
  const [triggerConfig, setTriggerConfig] = useState<Record<string, any>>(
    workflow?.trigger_config || {}
  );
  const [actions, setActions] = useState<Partial<WorkflowAction>[]>(
    workflow?.actions || []
  );
  const [showAddAction, setShowAddAction] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isEditing) {
        await updateWorkflow(workflow.id, {
          name,
          description,
          is_active: isActive,
          trigger_type: triggerType,
          trigger_config: triggerConfig
        });
      } else {
        const newWorkflow = await createWorkflow({
          business_id: businessId,
          name,
          description,
          is_active: isActive,
          trigger_type: triggerType,
          trigger_config: triggerConfig
        });

        // Add actions
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          if (action.action_type) {
            await addWorkflowAction({
              workflow_id: newWorkflow.id,
              action_type: action.action_type,
              action_config: action.action_config || {},
              execution_order: i
            });
          }
        }
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Workflow updated!' : 'Workflow created!');
      onSave();
    },
    onError: (error: any) => {
      toast.error('Failed to save workflow: ' + error.message);
    }
  });

  const handleAddAction = (actionType: WorkflowActionType, actionConfig: Record<string, any>) => {
    setActions([...actions, {
      action_type: actionType,
      action_config: actionConfig,
      execution_order: actions.length
    }]);
    setShowAddAction(false);
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleMoveAction = (index: number, direction: 'up' | 'down') => {
    const newActions = [...actions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newActions.length) return;
    
    [newActions[index], newActions[targetIndex]] = [newActions[targetIndex], newActions[index]];
    setActions(newActions);
  };

  const canSave = name.trim() && triggerType && actions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isEditing ? 'Edit Workflow' : 'Create Workflow'}
              </h1>
              <p className="text-blue-200/70">Configure your automation rules</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label className="text-white">Active</Label>
            </div>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!canSave || saveMutation.isPending}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : 'Save Workflow'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Workflow Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., VIP Customer Upgrade"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Description (optional)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does this workflow do?"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Trigger */}
            <TriggerSelector
              triggerType={triggerType}
              triggerConfig={triggerConfig}
              onTriggerTypeChange={setTriggerType}
              onTriggerConfigChange={setTriggerConfig}
            />

            {/* Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {actions.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-white/20 rounded-lg">
                    <p className="text-blue-200/60 mb-4">No actions configured yet</p>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddAction(true)}
                      className="bg-white/5 border-white/20 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Action
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {actions.map((action, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex flex-col gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleMoveAction(index, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4 text-blue-200/60" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleMoveAction(index, 'down')}
                            disabled={index === actions.length - 1}
                          >
                            <ChevronDown className="h-4 w-4 text-blue-200/60" />
                          </Button>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Step {index + 1}
                            </Badge>
                            <span className="font-medium text-white">
                              {action.action_type && ACTION_TYPE_LABELS[action.action_type]}
                            </span>
                          </div>
                          {action.action_config && Object.keys(action.action_config).length > 0 && (
                            <p className="text-sm text-blue-200/60 mt-1">
                              {JSON.stringify(action.action_config).substring(0, 50)}...
                            </p>
                          )}
                        </div>
                        
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                          onClick={() => handleRemoveAction(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowAddAction(true)}
                      className="w-full bg-white/5 border-white/20 text-white border-dashed"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Action
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Action Builder */}
          <div>
            {showAddAction ? (
              <ActionBuilder
                onAdd={handleAddAction}
                onCancel={() => setShowAddAction(false)}
              />
            ) : (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-blue-200/60 mb-1">When</p>
                    <p className="text-sm text-white">{TRIGGER_TYPE_LABELS[triggerType]}</p>
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div>
                    <p className="text-xs text-blue-200/60 mb-1">Then</p>
                    {actions.length === 0 ? (
                      <p className="text-sm text-blue-200/40 italic">No actions defined</p>
                    ) : (
                      <ul className="space-y-1">
                        {actions.map((action, i) => (
                          <li key={i} className="text-sm text-white">
                            {i + 1}. {action.action_type && ACTION_TYPE_LABELS[action.action_type]}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
