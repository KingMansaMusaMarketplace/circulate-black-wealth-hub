import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = '1325_session_id';
const sessionId = (() => {
  if (typeof window === 'undefined') return 'ssr';
  let s = sessionStorage.getItem(SESSION_KEY);
  if (!s) {
    s = `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, s);
  }
  return s;
})();

const seenImpressions = new Set<string>();

export async function trackFeaturedEvent(
  placementId: string,
  businessId: string,
  eventType: 'impression' | 'click',
  context: Record<string, any> = {}
) {
  try {
    if (eventType === 'impression') {
      // Dedupe impressions per session per placement
      if (seenImpressions.has(placementId)) return;
      seenImpressions.add(placementId);
    }
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('featured_placement_events').insert({
      placement_id: placementId,
      business_id: businessId,
      event_type: eventType,
      user_id: user?.id ?? null,
      session_id: sessionId,
      context,
    });
  } catch (e) {
    // Silent — tracking should never break UI
    console.debug('[featured-tracking] failed:', e);
  }
}
