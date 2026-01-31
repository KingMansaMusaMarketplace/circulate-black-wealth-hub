import { supabase } from '@/integrations/supabase/client';

export type AgentTaskType = 
  | 'lead_qualification' 
  | 'churn_prediction' 
  | 'deal_scoring' 
  | 'ticket_resolution' 
  | 'full_analysis';

export interface AgentTask {
  type: AgentTaskType;
  businessId: string;
  targetId?: string;
  context?: Record<string, unknown>;
}

export interface LeadScore {
  id: string;
  customer_id: string;
  score: number;
  engagement_score: number;
  fit_score: number;
  intent_score: number;
  recommended_action: string;
  ai_reasoning: string;
  scored_at: string;
}

export interface ChurnPrediction {
  id: string;
  customer_id: string;
  churn_probability: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: string[];
  recommended_actions: string[];
  ai_reasoning: string;
}

export interface DealScore {
  id: string;
  connection_id: string;
  deal_name: string;
  deal_value: number;
  close_probability: number;
  expected_close_date: string;
  competitor_risk: 'none' | 'low' | 'medium' | 'high';
  recommended_next_steps: string[];
}

export interface AgentAction {
  id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  ai_confidence: number;
  ai_reasoning: string;
  status: 'pending' | 'approved' | 'executed' | 'failed' | 'rejected';
  requires_approval: boolean;
  created_at: string;
}

export interface AgentRule {
  id: string;
  name: string;
  description: string;
  rule_type: string;
  trigger_conditions: Record<string, unknown>;
  action_type: string;
  action_config: Record<string, unknown>;
  requires_approval: boolean;
  confidence_threshold: number;
  is_active: boolean;
  execution_count: number;
}

// Run AI Agent task
export const runAgentTask = async (task: AgentTask) => {
  const { data, error } = await supabase.functions.invoke('ai-agent', {
    body: task
  });

  if (error) throw error;
  return data;
};

// Get lead scores for a business
export const getLeadScores = async (businessId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('lead_scores')
    .select(`
      *,
      customers:customer_id(id, name, email)
    `)
    .eq('business_id', businessId)
    .order('score', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

// Get churn predictions for a business
export const getChurnPredictions = async (businessId: string, riskLevel?: string) => {
  let query = supabase
    .from('churn_predictions')
    .select(`
      *,
      customers:customer_id(id, name, email, total_spent)
    `)
    .eq('business_id', businessId)
    .order('churn_probability', { ascending: false });

  if (riskLevel) {
    query = query.eq('risk_level', riskLevel);
  }

  const { data, error } = await query.limit(50);
  if (error) throw error;
  return data;
};

// Get deal scores for a business
export const getDealScores = async (businessId: string) => {
  const { data, error } = await supabase
    .from('deal_scores')
    .select('*')
    .eq('business_id', businessId)
    .order('close_probability', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
};

// Get agent actions history
export const getAgentActions = async (businessId: string, status?: string, limit = 100) => {
  let query = supabase
    .from('ai_agent_actions')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.limit(limit);
  if (error) throw error;
  return data;
};

// Get pending actions that need approval
export const getPendingApprovals = async (businessId: string) => {
  const { data, error } = await supabase
    .from('ai_agent_actions')
    .select('*')
    .eq('business_id', businessId)
    .eq('status', 'pending')
    .eq('requires_approval', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Approve or reject an agent action
export const reviewAgentAction = async (actionId: string, approved: boolean, userId: string) => {
  const { data, error } = await supabase
    .from('ai_agent_actions')
    .update({
      status: approved ? 'approved' : 'rejected',
      approved_by: userId,
      approved_at: new Date().toISOString()
    })
    .eq('id', actionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get agent rules for a business
export const getAgentRules = async (businessId: string) => {
  const { data, error } = await supabase
    .from('ai_agent_rules')
    .select('*')
    .eq('business_id', businessId)
    .order('priority', { ascending: true });

  if (error) throw error;
  return data;
};

// Create agent rule
export const createAgentRule = async (rule: Omit<AgentRule, 'id' | 'execution_count'> & { business_id: string }) => {
  const { data, error } = await supabase
    .from('ai_agent_rules')
    .insert(rule)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update agent rule
export const updateAgentRule = async (ruleId: string, updates: Partial<AgentRule>) => {
  const { data, error } = await supabase
    .from('ai_agent_rules')
    .update(updates)
    .eq('id', ruleId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Toggle agent rule active state
export const toggleAgentRule = async (ruleId: string, isActive: boolean) => {
  return updateAgentRule(ruleId, { is_active: isActive });
};

// Delete agent rule
export const deleteAgentRule = async (ruleId: string) => {
  const { error } = await supabase
    .from('ai_agent_rules')
    .delete()
    .eq('id', ruleId);

  if (error) throw error;
};

// Get agent dashboard stats
export const getAgentStats = async (businessId: string) => {
  const [
    { count: totalActions },
    { count: pendingApprovals },
    { data: recentScores },
    { data: highRiskChurn }
  ] = await Promise.all([
    supabase
      .from('ai_agent_actions')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId),
    supabase
      .from('ai_agent_actions')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('status', 'pending')
      .eq('requires_approval', true),
    supabase
      .from('lead_scores')
      .select('score')
      .eq('business_id', businessId)
      .gte('scored_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('churn_predictions')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .in('risk_level', ['high', 'critical'])
  ]);

  const avgLeadScore = recentScores?.length 
    ? Math.round(recentScores.reduce((sum, s) => sum + s.score, 0) / recentScores.length)
    : 0;

  return {
    totalActions: totalActions || 0,
    pendingApprovals: pendingApprovals || 0,
    avgLeadScore,
    highRiskCustomers: highRiskChurn?.length || 0
  };
};

// Rule type labels
export const RULE_TYPE_LABELS: Record<string, string> = {
  lead_qualification: 'Lead Qualification',
  churn_prevention: 'Churn Prevention',
  deal_scoring: 'Deal Scoring',
  ticket_resolution: 'Ticket Resolution',
  follow_up: 'Follow-up Automation',
  custom: 'Custom Rule'
};

// Action type labels
export const AGENT_ACTION_LABELS: Record<string, string> = {
  execute_workflow: 'Execute Workflow',
  send_notification: 'Send Notification',
  update_status: 'Update Status',
  add_tag: 'Add Tag',
  create_task: 'Create Task',
  auto_respond: 'Auto-Respond',
  escalate: 'Escalate'
};
