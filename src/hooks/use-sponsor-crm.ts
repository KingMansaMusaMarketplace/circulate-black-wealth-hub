import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type PipelineStage = 
  | 'research' 
  | 'outreach' 
  | 'contacted' 
  | 'meeting_scheduled' 
  | 'meeting_completed' 
  | 'proposal_sent' 
  | 'negotiation' 
  | 'closed_won' 
  | 'closed_lost' 
  | 'on_hold';

export interface SponsorProspect {
  id: string;
  company_name: string;
  industry: string | null;
  company_size: string | null;
  annual_revenue: string | null;
  employee_count: string | null;
  website: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  headquarters_city: string | null;
  headquarters_state: string | null;
  primary_contact_name: string | null;
  primary_contact_title: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  primary_contact_linkedin: string | null;
  secondary_contacts: any[];
  source: string | null;
  source_details: string | null;
  pipeline_stage: PipelineStage;
  stage_changed_at: string;
  expected_tier: string | null;
  expected_close_date: string | null;
  deal_value: number | null;
  deal_currency: string;
  probability: number;
  weighted_value: number | null;
  lost_reason: string | null;
  notes: string | null;
  tags: string[];
  priority: string;
  assigned_to: string | null;
  created_by: string | null;
  last_contact_at: string | null;
  next_follow_up: string | null;
  follow_up_notes: string | null;
  custom_fields: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OutreachActivity {
  id: string;
  prospect_id: string;
  activity_type: string;
  subject: string | null;
  body: string | null;
  outcome: string | null;
  outcome_notes: string | null;
  duration_minutes: number | null;
  scheduled_at: string | null;
  completed_at: string | null;
  is_completed: boolean;
  performed_by: string | null;
  email_message_id: string | null;
  email_opened: boolean;
  email_opened_at: string | null;
  email_clicked: boolean;
  email_clicked_at: string | null;
  meeting_link: string | null;
  meeting_recording_url: string | null;
  attachments: any[];
  created_at: string;
}

export interface PipelineSummary {
  stage: PipelineStage;
  count: number;
  total_value: number;
  weighted_value: number;
}

export const PIPELINE_STAGES: { value: PipelineStage; label: string; color: string }[] = [
  { value: 'research', label: 'Research', color: '#6B7280' },
  { value: 'outreach', label: 'Outreach', color: '#8B5CF6' },
  { value: 'contacted', label: 'Contacted', color: '#3B82F6' },
  { value: 'meeting_scheduled', label: 'Meeting Scheduled', color: '#06B6D4' },
  { value: 'meeting_completed', label: 'Meeting Completed', color: '#10B981' },
  { value: 'proposal_sent', label: 'Proposal Sent', color: '#F59E0B' },
  { value: 'negotiation', label: 'Negotiation', color: '#EC4899' },
  { value: 'closed_won', label: 'Closed Won', color: '#22C55E' },
  { value: 'closed_lost', label: 'Closed Lost', color: '#EF4444' },
  { value: 'on_hold', label: 'On Hold', color: '#9CA3AF' },
];

export const useSponsorCRM = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all prospects
  const { data: prospects, isLoading: prospectsLoading } = useQuery({
    queryKey: ['sponsor-prospects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_prospects')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as SponsorProspect[];
    },
    enabled: !!user,
  });

  // Fetch pipeline summary
  const { data: pipelineSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['pipeline-summary'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_sponsor_pipeline_summary');
      if (error) throw error;
      return data as PipelineSummary[];
    },
    enabled: !!user,
  });

  // Fetch activities for a prospect
  const useProspectActivities = (prospectId: string | null) => {
    return useQuery({
      queryKey: ['prospect-activities', prospectId],
      queryFn: async () => {
        if (!prospectId) return [];
        const { data, error } = await supabase
          .from('sponsor_outreach_activities')
          .select('*')
          .eq('prospect_id', prospectId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data as OutreachActivity[];
      },
      enabled: !!prospectId,
    });
  };

  // Fetch follow-up reminders
  const { data: followUps } = useQuery({
    queryKey: ['follow-up-reminders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_prospects')
        .select('id, company_name, next_follow_up, follow_up_notes, primary_contact_name')
        .not('next_follow_up', 'is', null)
        .lte('next_follow_up', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('next_follow_up', { ascending: true })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Create prospect mutation
  const createProspectMutation = useMutation({
    mutationFn: async (prospectData: Partial<SponsorProspect>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('sponsor_prospects')
        .insert({
          ...prospectData,
          created_by: user.id,
          assigned_to: prospectData.assigned_to || user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-prospects'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline-summary'] });
      toast.success('Prospect added!');
    },
    onError: (error) => {
      toast.error('Failed to add prospect');
      console.error(error);
    },
  });

  // Update prospect mutation
  const updateProspectMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SponsorProspect> & { id: string }) => {
      const { data, error } = await supabase
        .from('sponsor_prospects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-prospects'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline-summary'] });
    },
    onError: (error) => {
      toast.error('Failed to update prospect');
      console.error(error);
    },
  });

  // Move prospect to stage
  const moveToStageMutation = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: PipelineStage }) => {
      const { data, error } = await supabase
        .from('sponsor_prospects')
        .update({ pipeline_stage: stage })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-prospects'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline-summary'] });
      toast.success(`Moved to ${PIPELINE_STAGES.find(s => s.value === data.pipeline_stage)?.label}`);
    },
    onError: (error) => {
      toast.error('Failed to move prospect');
      console.error(error);
    },
  });

  // Log activity mutation
  const logActivityMutation = useMutation({
    mutationFn: async (activityData: Partial<OutreachActivity>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('sponsor_outreach_activities')
        .insert({
          ...activityData,
          performed_by: user.id,
          is_completed: activityData.completed_at ? true : false,
        })
        .select()
        .single();

      if (error) throw error;

      // Update last_contact_at on the prospect
      if (activityData.prospect_id && activityData.is_completed) {
        await supabase
          .from('sponsor_prospects')
          .update({ last_contact_at: new Date().toISOString() })
          .eq('id', activityData.prospect_id);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prospect-activities', data.prospect_id] });
      queryClient.invalidateQueries({ queryKey: ['sponsor-prospects'] });
      toast.success('Activity logged!');
    },
    onError: (error) => {
      toast.error('Failed to log activity');
      console.error(error);
    },
  });

  // Delete prospect mutation
  const deleteProspectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sponsor_prospects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-prospects'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline-summary'] });
      toast.success('Prospect deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete prospect');
      console.error(error);
    },
  });

  // Group prospects by stage
  const prospectsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.value] = (prospects || []).filter(p => p.pipeline_stage === stage.value);
    return acc;
  }, {} as Record<PipelineStage, SponsorProspect[]>);

  // Calculate metrics
  const metrics = {
    totalProspects: prospects?.length || 0,
    totalPipelineValue: prospects?.reduce((sum, p) => sum + (p.deal_value || 0), 0) || 0,
    weightedPipelineValue: prospects?.reduce((sum, p) => sum + (p.weighted_value || 0), 0) || 0,
    closedWonValue: prospects?.filter(p => p.pipeline_stage === 'closed_won').reduce((sum, p) => sum + (p.deal_value || 0), 0) || 0,
    avgDealSize: prospects?.length ? 
      (prospects.reduce((sum, p) => sum + (p.deal_value || 0), 0) / prospects.length) : 0,
    conversionRate: prospects?.length ?
      ((prospects.filter(p => p.pipeline_stage === 'closed_won').length / prospects.length) * 100) : 0,
  };

  return {
    prospects: prospects || [],
    prospectsByStage,
    pipelineSummary: pipelineSummary || [],
    followUps: followUps || [],
    metrics,
    isLoading: prospectsLoading || summaryLoading,
    useProspectActivities,
    createProspect: createProspectMutation.mutate,
    creatingProspect: createProspectMutation.isPending,
    updateProspect: updateProspectMutation.mutate,
    updatingProspect: updateProspectMutation.isPending,
    moveToStage: moveToStageMutation.mutate,
    movingToStage: moveToStageMutation.isPending,
    logActivity: logActivityMutation.mutate,
    loggingActivity: logActivityMutation.isPending,
    deleteProspect: deleteProspectMutation.mutate,
    deletingProspect: deleteProspectMutation.isPending,
  };
};
