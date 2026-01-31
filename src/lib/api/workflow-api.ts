import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type WorkflowTriggerType = 
  | 'purchase'
  | 'customer_created'
  | 'customer_updated'
  | 'tag_added'
  | 'tag_removed'
  | 'inactivity'
  | 'threshold_reached'
  | 'custom';

export type WorkflowActionType = 
  | 'send_email'
  | 'add_tag'
  | 'remove_tag'
  | 'update_status'
  | 'notify_user'
  | 'create_task'
  | 'update_customer_field'
  | 'webhook';

export type WorkflowExecutionStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped';

export interface Workflow {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  trigger_type: WorkflowTriggerType;
  trigger_config: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
  actions?: WorkflowAction[];
}

export interface WorkflowAction {
  id: string;
  workflow_id: string;
  action_type: WorkflowActionType;
  action_config: Record<string, any>;
  execution_order: number;
  created_at: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  customer_id?: string;
  trigger_data: Record<string, any>;
  status: WorkflowExecutionStatus;
  error_message?: string;
  executed_at: string;
  completed_at?: string;
}

// Get all workflows for a business
export const getWorkflows = async (businessId: string): Promise<Workflow[]> => {
  const { data, error } = await supabase
    .from('workflows')
    .select(`
      *,
      actions:workflow_actions(*)
    `)
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Workflow[];
};

// Get single workflow with actions
export const getWorkflow = async (workflowId: string): Promise<Workflow> => {
  const { data, error } = await supabase
    .from('workflows')
    .select(`
      *,
      actions:workflow_actions(*)
    `)
    .eq('id', workflowId)
    .single();

  if (error) throw error;
  return data as Workflow;
};

// Create workflow
export const createWorkflow = async (
  workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at' | 'actions'>
): Promise<Workflow> => {
  const { data, error } = await supabase
    .from('workflows')
    .insert(workflow)
    .select()
    .single();

  if (error) throw error;
  toast.success('Workflow created successfully!');
  return data as Workflow;
};

// Update workflow
export const updateWorkflow = async (
  workflowId: string,
  updates: Partial<Workflow>
): Promise<Workflow> => {
  const { data, error } = await supabase
    .from('workflows')
    .update(updates)
    .eq('id', workflowId)
    .select()
    .single();

  if (error) throw error;
  toast.success('Workflow updated successfully!');
  return data as Workflow;
};

// Delete workflow
export const deleteWorkflow = async (workflowId: string): Promise<void> => {
  const { error } = await supabase
    .from('workflows')
    .delete()
    .eq('id', workflowId);

  if (error) throw error;
  toast.success('Workflow deleted successfully!');
};

// Toggle workflow active state
export const toggleWorkflow = async (
  workflowId: string,
  isActive: boolean
): Promise<Workflow> => {
  return updateWorkflow(workflowId, { is_active: isActive });
};

// Add action to workflow
export const addWorkflowAction = async (
  action: Omit<WorkflowAction, 'id' | 'created_at'>
): Promise<WorkflowAction> => {
  const { data, error } = await supabase
    .from('workflow_actions')
    .insert(action)
    .select()
    .single();

  if (error) throw error;
  return data as WorkflowAction;
};

// Update workflow action
export const updateWorkflowAction = async (
  actionId: string,
  updates: Partial<WorkflowAction>
): Promise<WorkflowAction> => {
  const { data, error } = await supabase
    .from('workflow_actions')
    .update(updates)
    .eq('id', actionId)
    .select()
    .single();

  if (error) throw error;
  return data as WorkflowAction;
};

// Delete workflow action
export const deleteWorkflowAction = async (actionId: string): Promise<void> => {
  const { error } = await supabase
    .from('workflow_actions')
    .delete()
    .eq('id', actionId);

  if (error) throw error;
};

// Get workflow executions
export const getWorkflowExecutions = async (
  workflowId: string,
  limit = 50
): Promise<WorkflowExecution[]> => {
  const { data, error } = await supabase
    .from('workflow_executions')
    .select('*')
    .eq('workflow_id', workflowId)
    .order('executed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as WorkflowExecution[];
};

// Trigger type display names
export const TRIGGER_TYPE_LABELS: Record<WorkflowTriggerType, string> = {
  purchase: 'When a purchase is made',
  customer_created: 'When a new customer is created',
  customer_updated: 'When a customer is updated',
  tag_added: 'When a tag is added',
  tag_removed: 'When a tag is removed',
  inactivity: 'When customer is inactive',
  threshold_reached: 'When a threshold is reached',
  custom: 'Custom trigger'
};

// Action type display names
export const ACTION_TYPE_LABELS: Record<WorkflowActionType, string> = {
  send_email: 'Send an email',
  add_tag: 'Add a tag',
  remove_tag: 'Remove a tag',
  update_status: 'Update customer status',
  notify_user: 'Send notification',
  create_task: 'Create a task',
  update_customer_field: 'Update customer field',
  webhook: 'Call webhook'
};
