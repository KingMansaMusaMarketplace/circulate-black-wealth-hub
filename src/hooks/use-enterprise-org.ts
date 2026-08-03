import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const PENDING_ORG_JOIN_KEY = 'pending_org_join';

export interface EnterpriseOrg {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  tagline: string | null;
  website_url: string | null;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  invite_code: string | null;
  revenue_share_pct: number;
  status: string;
  is_public: boolean;
  launch_date: string | null;
  term_years: number;
  member_reach: number | null;
}

export interface OrgOnboardingTask {
  id: string;
  week_number: number;
  division: string | null;
  title: string;
  description: string | null;
  owner_side: string;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  sort_order: number;
}

export interface OrgRevenueEvent {
  id: string;
  event_type: string;
  description: string | null;
  gross_amount_cents: number;
  share_pct: number;
  share_amount_cents: number;
  occurred_at: string;
}

/** Public org profile, looked up by its URL slug (e.g. "aames"). */
export const useEnterpriseOrg = (slug?: string) =>
  useQuery({
    queryKey: ['enterprise-org', slug],
    enabled: !!slug,
    queryFn: async (): Promise<EnterpriseOrg | null> => {
      const { data, error } = await supabase
        .from('enterprise_orgs')
        .select('*')
        .eq('slug', slug!)
        .maybeSingle();
      if (error) throw error;
      return (data as EnterpriseOrg) ?? null;
    },
  });

/** The signed-in user's membership row for this org, if any. */
export const useOrgMembership = (orgId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['enterprise-org-membership', orgId, user?.id],
    enabled: !!orgId && !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_org_members')
        .select('*')
        .eq('org_id', orgId!)
        .eq('user_id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

/** True when the signed-in user holds an active leadership seat for this org. */
export const useOrgLeader = (orgId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['enterprise-org-leader', orgId, user?.id],
    enabled: !!orgId && !!user?.id,
    queryFn: async () => {
      // Bind any seat that was invited by email before this account existed.
      await supabase.rpc('claim_enterprise_leader_seats');

      const { data, error } = await supabase
        .from('enterprise_org_leaders')
        .select('*')
        .eq('org_id', orgId!)
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

/** Partner-side onboarding task completion (leaders only, their own tasks). */
export const useToggleOrgTask = (orgId?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; complete: boolean }) => {
      const { error } = await supabase
        .from('enterprise_org_onboarding_tasks')
        .update({
          status: params.complete ? 'completed' : 'pending',
          completed_at: params.complete ? new Date().toISOString() : null,
        })
        .eq('id', params.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enterprise-org-dashboard', orgId] }),
  });
};


export const useJoinOrg = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      orgId: string;
      memberType: 'member' | 'business_owner';
      source?: string;
    }) => {
      if (!user?.id) throw new Error('You need to be signed in to join.');
      const { data, error } = await supabase
        .from('enterprise_org_members')
        .upsert(
          {
            org_id: params.orgId,
            user_id: user.id,
            member_type: params.memberType,
            source: params.source ?? 'landing_page',
          },
          { onConflict: 'org_id,user_id' }
        )
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['enterprise-org-membership', vars.orgId] });
    },
  });
};

/** Leader-only dashboard data: members, chapters, revenue, onboarding. */
export const useOrgDashboard = (orgId?: string, isLeader?: boolean) =>
  useQuery({
    queryKey: ['enterprise-org-dashboard', orgId],
    enabled: !!orgId && !!isLeader,
    queryFn: async () => {
      const [members, chapters, revenue, tasks, leaders] = await Promise.all([
        supabase.from('enterprise_org_members').select('id, member_type, created_at, business_id').eq('org_id', orgId!),
        supabase.from('enterprise_org_chapters').select('id, name, city, state').eq('org_id', orgId!),
        supabase
          .from('enterprise_org_revenue_events')
          .select('*')
          .eq('org_id', orgId!)
          .order('occurred_at', { ascending: false })
          .limit(100),
        supabase
          .from('enterprise_org_onboarding_tasks')
          .select('*')
          .eq('org_id', orgId!)
          .order('week_number', { ascending: true })
          .order('sort_order', { ascending: true }),
        supabase.from('enterprise_org_leaders').select('*').eq('org_id', orgId!).eq('is_active', true),
      ]);

      const firstError =
        members.error || chapters.error || revenue.error || tasks.error || leaders.error;
      if (firstError) throw firstError;

      return {
        members: members.data ?? [],
        chapters: chapters.data ?? [],
        revenue: (revenue.data ?? []) as OrgRevenueEvent[],
        tasks: (tasks.data ?? []) as OrgOnboardingTask[],
        leaders: leaders.data ?? [],
      };
    },
  });
