import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type OutreachStatus =
  | 'researched'
  | 'intro_sent'
  | 'replied'
  | 'meeting_booked'
  | 'in_discussion'
  | 'allied'
  | 'declined'
  | 'paused';

export type OutreachTier = 'tier_1' | 'tier_2' | 'tier_3';

export type OutreachChannel =
  | 'email'
  | 'linkedin'
  | 'contact_form'
  | 'phone'
  | 'meeting'
  | 'sms'
  | 'other';

export type OutreachDirection = 'outbound' | 'inbound';

export interface OutreachTarget {
  id: string;
  directory_name: string;
  tier: OutreachTier;
  owner_name: string | null;
  owner_title: string | null;
  website: string | null;
  contact_method: OutreachChannel | null;
  contact_value: string | null;
  linkedin_url: string | null;
  location: string | null;
  status: OutreachStatus;
  priority: number;
  assigned_to: string | null;
  next_action: string | null;
  next_action_date: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface OutreachTouch {
  id: string;
  target_id: string;
  channel: OutreachChannel;
  direction: OutreachDirection;
  subject: string | null;
  body: string | null;
  occurred_at: string;
  created_by: string | null;
  created_at: string;
}

export const STATUS_LABELS: Record<OutreachStatus, string> = {
  researched: 'Researched',
  intro_sent: 'Intro Sent',
  replied: 'Replied',
  meeting_booked: 'Meeting Booked',
  in_discussion: 'In Discussion',
  allied: 'Allied',
  declined: 'Declined',
  paused: 'Paused',
};

export const TIER_LABELS: Record<OutreachTier, string> = {
  tier_1: 'Tier 1',
  tier_2: 'Tier 2',
  tier_3: 'Tier 3',
};

export const CHANNEL_LABELS: Record<OutreachChannel, string> = {
  email: 'Email',
  linkedin: 'LinkedIn',
  contact_form: 'Contact Form',
  phone: 'Phone',
  meeting: 'Meeting',
  sms: 'SMS',
  other: 'Other',
};

export function useOutreachTargets() {
  const queryClient = useQueryClient();

  const { data: targets = [], isLoading } = useQuery({
    queryKey: ['outreach_targets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outreach_targets')
        .select('*')
        .order('tier', { ascending: true })
        .order('priority', { ascending: true })
        .order('directory_name', { ascending: true });
      if (error) throw error;
      return (data || []) as OutreachTarget[];
    },
  });

  const createTarget = useMutation({
    mutationFn: async (input: Partial<OutreachTarget>) => {
      const { data: userRes } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('outreach_targets')
        .insert({
          directory_name: input.directory_name!,
          tier: input.tier ?? 'tier_2',
          owner_name: input.owner_name ?? null,
          owner_title: input.owner_title ?? null,
          website: input.website ?? null,
          contact_method: input.contact_method ?? null,
          contact_value: input.contact_value ?? null,
          linkedin_url: input.linkedin_url ?? null,
          location: input.location ?? null,
          status: input.status ?? 'researched',
          priority: input.priority ?? 3,
          next_action: input.next_action ?? null,
          next_action_date: input.next_action_date ?? null,
          notes: input.notes ?? null,
          created_by: userRes.user?.id ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach_targets'] });
      toast.success('Target added');
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to add target'),
  });

  const updateTarget = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<OutreachTarget> }) => {
      const { data, error } = await supabase
        .from('outreach_targets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach_targets'] });
    },
    onError: (e: any) => toast.error(e.message ?? 'Update failed'),
  });

  const deleteTarget = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('outreach_targets').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach_targets'] });
      toast.success('Target removed');
    },
    onError: (e: any) => toast.error(e.message ?? 'Delete failed'),
  });

  return { targets, isLoading, createTarget, updateTarget, deleteTarget };
}

export function useOutreachTouches(targetId: string | null) {
  const queryClient = useQueryClient();

  const { data: touches = [], isLoading } = useQuery({
    queryKey: ['outreach_touches', targetId],
    enabled: !!targetId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outreach_touches')
        .select('*')
        .eq('target_id', targetId!)
        .order('occurred_at', { ascending: false });
      if (error) throw error;
      return (data || []) as OutreachTouch[];
    },
  });

  const logTouch = useMutation({
    mutationFn: async (input: Partial<OutreachTouch>) => {
      const { data: userRes } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('outreach_touches')
        .insert({
          target_id: input.target_id!,
          channel: input.channel ?? 'email',
          direction: input.direction ?? 'outbound',
          subject: input.subject ?? null,
          body: input.body ?? null,
          occurred_at: input.occurred_at ?? new Date().toISOString(),
          created_by: userRes.user?.id ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['outreach_touches', vars.target_id] });
      toast.success('Touch logged');
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to log touch'),
  });

  return { touches, isLoading, logTouch };
}
