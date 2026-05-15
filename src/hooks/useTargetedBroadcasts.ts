import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TargetFilters {
  user_type?: string;
  subscription_tier?: string;
  city?: string;
  state?: string;
  is_founding_member?: boolean;
  is_hbcu_member?: boolean;
  signed_up_within_days?: number;
}

export interface TargetedBroadcast {
  id: string;
  title: string;
  message: string;
  announcement_type: string;
  priority: number;
  starts_at: string;
  expires_at: string | null;
  target_filters: TargetFilters | null;
}

interface ProfileLite {
  user_type?: string | null;
  subscription_tier?: string | null;
  city?: string | null;
  state?: string | null;
  is_founding_member?: boolean | null;
  is_hbcu_member?: boolean | null;
  created_at?: string | null;
}

const matches = (filters: TargetFilters | null, profile: ProfileLite | null) => {
  if (!filters || Object.keys(filters).length === 0) return true;
  if (!profile) return false;
  if (filters.user_type && profile.user_type !== filters.user_type) return false;
  if (filters.subscription_tier && profile.subscription_tier !== filters.subscription_tier) return false;
  if (filters.city && (profile.city || '').toLowerCase() !== filters.city.toLowerCase()) return false;
  if (filters.state && (profile.state || '').toLowerCase() !== filters.state.toLowerCase()) return false;
  if (filters.is_founding_member && !profile.is_founding_member) return false;
  if (filters.is_hbcu_member && !profile.is_hbcu_member) return false;
  if (filters.signed_up_within_days && filters.signed_up_within_days > 0) {
    if (!profile.created_at) return false;
    const ageMs = Date.now() - new Date(profile.created_at).getTime();
    if (ageMs > filters.signed_up_within_days * 86400000) return false;
  }
  return true;
};

export const useTargetedBroadcasts = () => {
  const { user } = useAuth();
  const [broadcasts, setBroadcasts] = useState<TargetedBroadcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const nowIso = new Date().toISOString();
        const { data: ann } = await supabase
          .from('broadcast_announcements')
          .select('id,title,message,announcement_type,priority,starts_at,expires_at,target_filters,target_audience,is_active')
          .eq('is_active', true)
          .lte('starts_at', nowIso)
          .order('priority', { ascending: false });

        let profile: ProfileLite | null = null;
        if (user?.id) {
          const { data } = await supabase
            .from('profiles')
            .select('user_type,subscription_tier,city,state,is_founding_member,is_hbcu_member,created_at')
            .eq('id', user.id)
            .maybeSingle();
          profile = data as ProfileLite | null;
        }

        const active = (ann || []).filter((a: any) => {
          if (a.expires_at && new Date(a.expires_at).getTime() < Date.now()) return false;
          // Audience gating
          if (a.target_audience === 'authenticated' && !user) return false;
          if (a.target_audience === 'guests' && user) return false;
          return matches(a.target_filters as TargetFilters | null, profile);
        });

        if (!cancelled) setBroadcasts(active as TargetedBroadcast[]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  return { broadcasts, loading };
};
