import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ImportSource {
  id: string;
  source_name: string;
  source_type: string;
  api_endpoint: string | null;
  description: string | null;
  field_mapping: Record<string, string>;
  last_import_at: string | null;
  total_imported: number;
  total_converted: number;
  is_active: boolean;
}

export interface ImportJob {
  id: string;
  source_id: string | null;
  initiated_by: string;
  job_name: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  source_file_url: string | null;
  query_params: Record<string, any>;
  field_mapping: Record<string, string>;
  businesses_found: number;
  businesses_imported: number;
  duplicates_skipped: number;
  errors_count: number;
  error_details: any[];
  progress_percent: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface BulkInvitationCampaign {
  id: string;
  name: string;
  description: string | null;
  template_id: string | null;
  target_criteria: Record<string, any>;
  target_cities: string[] | null;
  target_categories: string[] | null;
  target_states: string[] | null;
  exclude_previously_invited: boolean;
  min_days_between_invites: number;
  total_targets: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  claimed_count: number;
  bounced_count: number;
  status: 'draft' | 'scheduled' | 'sending' | 'paused' | 'completed' | 'cancelled';
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  send_rate_per_hour: number;
  created_by: string | null;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  template_type: 'email' | 'sms' | 'both';
  subject: string | null;
  body: string;
  variables: string[];
  is_default: boolean;
  is_active: boolean;
  send_count: number;
  open_count: number;
  click_count: number;
}

export interface ExternalLead {
  id: string;
  business_name: string;
  business_description: string | null;
  category: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  website_url: string | null;
  owner_name: string | null;
  owner_email: string | null;
  phone_number: string | null;
  email_status: string;
  invitation_count: number;
  last_invited_at: string | null;
  lead_score: number | null;
  data_quality_score: number | null;
  claim_status: string | null;
  is_converted: boolean | null;
  created_at: string | null;
}

export const useBusinessImport = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch import sources
  const { data: sources, isLoading: sourcesLoading } = useQuery({
    queryKey: ['import-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_import_sources')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ImportSource[];
    },
    enabled: !!user,
  });

  // Fetch import jobs
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['import-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_import_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as ImportJob[];
    },
    enabled: !!user,
  });

  // Fetch bulk invitation campaigns
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['bulk-invitation-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bulk_invitation_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BulkInvitationCampaign[];
    },
    enabled: !!user,
  });

  // Fetch invitation templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['invitation-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invitation_templates')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false });
      if (error) throw error;
      return data as InvitationTemplate[];
    },
    enabled: !!user,
  });

  // Fetch external leads with filters
  const useLeads = (filters?: { city?: string; state?: string; category?: string; status?: string }) => {
    return useQuery({
      queryKey: ['external-leads', filters],
      queryFn: async () => {
        let query = supabase
          .from('b2b_external_leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (filters?.city) query = query.eq('city', filters.city);
        if (filters?.state) query = query.eq('state', filters.state);
        if (filters?.category) query = query.eq('category', filters.category);
        if (filters?.status) query = query.eq('email_status', filters.status);

        const { data, error } = await query;
        if (error) throw error;
        return data as ExternalLead[];
      },
      enabled: !!user,
    });
  };

  // Get lead statistics
  const { data: leadStats } = useQuery({
    queryKey: ['lead-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('b2b_external_leads')
        .select('email_status, claim_status, is_converted')
        .limit(10000);
      
      if (error) throw error;

      const stats = {
        total: data.length,
        not_sent: data.filter(l => l.email_status === 'not_sent').length,
        sent: data.filter(l => l.email_status === 'sent').length,
        opened: data.filter(l => l.email_status === 'opened').length,
        clicked: data.filter(l => l.email_status === 'clicked').length,
        claimed: data.filter(l => l.claim_status === 'claimed').length,
        converted: data.filter(l => l.is_converted).length,
      };

      return stats;
    },
    enabled: !!user,
  });

  // Create import job mutation
  const createImportJobMutation = useMutation({
    mutationFn: async (jobData: {
      job_name: string;
      source_id?: string;
      source_file_url?: string;
      field_mapping: Record<string, string>;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('business_import_jobs')
        .insert({
          ...jobData,
          initiated_by: user.id,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['import-jobs'] });
      toast.success('Import job created!');
    },
    onError: (error) => {
      toast.error('Failed to create import job');
      console.error(error);
    },
  });

  // Create bulk invitation campaign
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: {
      name: string;
      description?: string;
      template_id: string;
      target_cities?: string[];
      target_categories?: string[];
      target_states?: string[];
      scheduled_at?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Count matching leads
      let query = supabase.from('b2b_external_leads').select('id', { count: 'exact' });
      if (campaignData.target_cities?.length) {
        query = query.in('city', campaignData.target_cities);
      }
      if (campaignData.target_states?.length) {
        query = query.in('state', campaignData.target_states);
      }
      if (campaignData.target_categories?.length) {
        query = query.in('category', campaignData.target_categories);
      }

      const { count } = await query;

      const { data, error } = await supabase
        .from('bulk_invitation_campaigns')
        .insert({
          ...campaignData,
          created_by: user.id,
          total_targets: count || 0,
          status: campaignData.scheduled_at ? 'scheduled' : 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-invitation-campaigns'] });
      toast.success('Campaign created!');
    },
    onError: (error) => {
      toast.error('Failed to create campaign');
      console.error(error);
    },
  });

  // Start campaign
  const startCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const { data, error } = await supabase
        .from('bulk_invitation_campaigns')
        .update({
          status: 'sending',
          started_at: new Date().toISOString(),
        })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;

      // Trigger edge function to start sending
      const { error: fnError } = await supabase.functions.invoke('send-bulk-claim-invitations', {
        body: { campaign_id: campaignId },
      });

      if (fnError) throw fnError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-invitation-campaigns'] });
      toast.success('Campaign started!');
    },
    onError: (error) => {
      toast.error('Failed to start campaign');
      console.error(error);
    },
  });

  // Parse CSV and import leads
  const importFromCSV = async (file: File, fieldMapping: Record<string, string>) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('field_mapping', JSON.stringify(fieldMapping));

    const { data, error } = await supabase.functions.invoke('import-businesses-csv', {
      body: formData,
    });

    if (error) throw error;
    
    queryClient.invalidateQueries({ queryKey: ['external-leads'] });
    queryClient.invalidateQueries({ queryKey: ['import-jobs'] });
    queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
    
    return data;
  };

  return {
    sources: sources || [],
    jobs: jobs || [],
    campaigns: campaigns || [],
    templates: templates || [],
    leadStats,
    useLeads,
    isLoading: sourcesLoading || jobsLoading || campaignsLoading || templatesLoading,
    createImportJob: createImportJobMutation.mutate,
    creatingJob: createImportJobMutation.isPending,
    createCampaign: createCampaignMutation.mutate,
    creatingCampaign: createCampaignMutation.isPending,
    startCampaign: startCampaignMutation.mutate,
    startingCampaign: startCampaignMutation.isPending,
    importFromCSV,
  };
};
