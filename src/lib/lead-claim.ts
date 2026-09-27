import { supabase } from '@/integrations/supabase/client';

/** Remembers which discovered listing an owner chose to claim, until they sign in. */
export const PENDING_LEAD_CLAIM_KEY = 'pendingLeadClaim';
// Short window: long enough to finish sign-up / email confirmation, short enough not to hijack a later session.
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export interface PendingLeadClaim { leadId: string; name?: string; at: number }

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const savePendingLeadClaim = (leadId: string, name?: string) => {
  if (!UUID_RE.test(leadId)) return;
  try { localStorage.setItem(PENDING_LEAD_CLAIM_KEY, JSON.stringify({ leadId, name, at: Date.now() })); } catch { /* ignore */ }
};

export const readPendingLeadClaim = (): PendingLeadClaim | null => {
  try {
    const v = JSON.parse(localStorage.getItem(PENDING_LEAD_CLAIM_KEY) || 'null') as PendingLeadClaim | null;
    if (!v?.leadId || !UUID_RE.test(v.leadId)) return null;
    if (!v.at || Date.now() - v.at > MAX_AGE_MS) { clearPendingLeadClaim(); return null; }
    return v;
  } catch { return null; }
};

export const clearPendingLeadClaim = () => {
  try { localStorage.removeItem(PENDING_LEAD_CLAIM_KEY); } catch { /* ignore */ }
};

/** Saves a claim request for the signed-in user. Duplicates are treated as success. */
export const submitLeadClaimRequest = async (leadId: string, userId: string) => {
  const { error } = await (supabase as any)
    .from('lead_claim_requests')
    .insert({ lead_id: leadId, user_id: userId });
  if (error && error.code !== '23505') throw error;
};
