import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminOrg {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  status: string;
  member_reach: number | null;
  revenue_share_pct: number;
}

export interface AdminLeaderSeat {
  id: string;
  org_id: string;
  user_id: string | null;
  invite_email: string | null;
  display_name: string | null;
  title: string;
  division: string | null;
  is_active: boolean;
  claimed_at: string | null;
  created_at: string;
}

export interface AdminChapter {
  id: string;
  org_id: string;
  name: string;
  city: string | null;
  state: string | null;
  contact_email: string | null;
}

/** All partner organizations (admin only). */
export const useAdminOrgs = () =>
  useQuery({
    queryKey: ['admin-enterprise-orgs'],
    queryFn: async (): Promise<AdminOrg[]> => {
      const { data, error } = await supabase
        .from('enterprise_orgs')
        .select('id, slug, name, short_name, status, member_reach, revenue_share_pct')
        .order('name');
      if (error) throw error;
      return (data ?? []) as AdminOrg[];
    },
  });

export const useAdminLeaderSeats = (orgId?: string) =>
  useQuery({
    queryKey: ['admin-org-leaders', orgId],
    enabled: !!orgId,
    queryFn: async (): Promise<AdminLeaderSeat[]> => {
      const { data, error } = await supabase
        .from('enterprise_org_leaders')
        .select('*')
        .eq('org_id', orgId!)
        .order('created_at');
      if (error) throw error;
      return (data ?? []) as AdminLeaderSeat[];
    },
  });

export const useAdminChapters = (orgId?: string) =>
  useQuery({
    queryKey: ['admin-org-chapters', orgId],
    enabled: !!orgId,
    queryFn: async (): Promise<AdminChapter[]> => {
      const { data, error } = await supabase
        .from('enterprise_org_chapters')
        .select('id, org_id, name, city, state, contact_email')
        .eq('org_id', orgId!)
        .order('name');
      if (error) throw error;
      return (data ?? []) as AdminChapter[];
    },
  });

export const useAdminOrgCounts = (orgId?: string) =>
  useQuery({
    queryKey: ['admin-org-counts', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const [members, businesses, revenue] = await Promise.all([
        supabase
          .from('enterprise_org_members')
          .select('id', { count: 'exact', head: true })
          .eq('org_id', orgId!),
        supabase
          .from('enterprise_org_members')
          .select('id', { count: 'exact', head: true })
          .eq('org_id', orgId!)
          .eq('member_type', 'business_owner'),
        supabase
          .from('enterprise_org_revenue_events')
          .select('share_amount_cents')
          .eq('org_id', orgId!),
      ]);
      const shareCents = (revenue.data ?? []).reduce(
        (sum: number, r: any) => sum + (r.share_amount_cents ?? 0),
        0
      );
      return {
        members: members.count ?? 0,
        businesses: businesses.count ?? 0,
        shareCents,
      };
    },
  });

export const useAddLeaderSeat = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      orgId: string;
      email: string;
      title: string;
      displayName?: string;
      division?: string;
    }) => {
      const { error } = await supabase.from('enterprise_org_leaders').insert({
        org_id: params.orgId,
        invite_email: params.email.trim().toLowerCase(),
        title: params.title,
        display_name: params.displayName?.trim() || null,
        division: params.division?.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['admin-org-leaders', v.orgId] }),
  });
};

export const useToggleLeaderSeat = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; orgId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('enterprise_org_leaders')
        .update({ is_active: params.isActive })
        .eq('id', params.id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['admin-org-leaders', v.orgId] }),
  });
};

export const useRemoveLeaderSeat = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; orgId: string }) => {
      const { error } = await supabase.from('enterprise_org_leaders').delete().eq('id', params.id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['admin-org-leaders', v.orgId] }),
  });
};

export interface ChapterInput {
  name: string;
  city?: string | null;
  state?: string | null;
  contact_email?: string | null;
}

/** Parses a pasted spreadsheet (CSV or tab separated): name, city, state, email. */
export const parseChapterRows = (raw: string): ChapterInput[] => {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(line.includes('\t') ? '\t' : ',').map((c) => c.trim()))
    .filter((cols) => cols[0] && cols[0].toLowerCase() !== 'name')
    .map((cols) => ({
      name: cols[0],
      city: cols[1] || null,
      state: cols[2] || null,
      contact_email: cols[3] || null,
    }));
};

export const useAddChapters = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { orgId: string; rows: ChapterInput[] }) => {
      if (!params.rows.length) throw new Error('No chapters to add.');
      const { error } = await supabase
        .from('enterprise_org_chapters')
        .insert(params.rows.map((r) => ({ ...r, org_id: params.orgId })));
      if (error) throw error;
      return params.rows.length;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['admin-org-chapters', v.orgId] }),
  });
};

export const useDeleteChapter = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; orgId: string }) => {
      const { error } = await supabase.from('enterprise_org_chapters').delete().eq('id', params.id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['admin-org-chapters', v.orgId] }),
  });
};
