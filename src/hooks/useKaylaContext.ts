import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface KaylaBusinessContext {
  id: string;
  business_id: string;
  goals: Array<{ text: string; created_at?: string }>;
  recent_decisions: Array<{ agent: string; summary: string; at: string }>;
  key_metrics: Record<string, number | string>;
  preferences: Record<string, unknown>;
  summary: string | null;
  last_updated_by: string | null;
  updated_at: string;
}

/**
 * Shared business memory layer. Any Kayla agent (or panel) can read or
 * append to the same context so the team feels coordinated.
 */
export function useKaylaContext(businessId?: string) {
  const [context, setContext] = useState<KaylaBusinessContext | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('kayla_business_context' as any)
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle();
    setContext((data as any) || null);
    setLoading(false);
  }, [businessId]);

  useEffect(() => { fetch(); }, [fetch]);

  /** Append a decision from any agent. Keeps the last 20. */
  const recordDecision = useCallback(async (agent: string, summary: string) => {
    if (!businessId) return;
    const next = [
      { agent, summary, at: new Date().toISOString() },
      ...((context?.recent_decisions ?? []) as any[]),
    ].slice(0, 20);
    const { data, error } = await supabase
      .from('kayla_business_context' as any)
      .upsert(
        { business_id: businessId, recent_decisions: next, last_updated_by: agent },
        { onConflict: 'business_id' }
      )
      .select()
      .single();
    if (!error && data) setContext(data as any);
  }, [businessId, context]);

  return { context, loading, refresh: fetch, recordDecision };
}
