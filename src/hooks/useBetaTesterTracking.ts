import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Tracks session time and daily activity for beta testers.
 * Runs silently — only activates if the current user is an active beta tester.
 */
export const useBetaTesterTracking = () => {
  const { user } = useAuth();
  const sessionIdRef = useRef<string | null>(null);
  const betaTesterIdRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const startTracking = async () => {
      // Check if user is a beta tester
      const { data: tester } = await supabase
        .from('beta_testers')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (!tester || cancelled) return;

      betaTesterIdRef.current = tester.id;

      // Start a new session
      const { data: session } = await supabase
        .from('beta_tester_sessions')
        .insert({
          beta_tester_id: tester.id,
          user_id: user.id,
        } as any)
        .select('id')
        .single();

      if (session) {
        sessionIdRef.current = session.id;
      }

      // Upsert daily activity
      const today = new Date().toISOString().split('T')[0];
      await supabase
        .from('beta_tester_daily_activity')
        .upsert({
          beta_tester_id: tester.id,
          user_id: user.id,
          activity_date: today,
          page_views: 1,
          actions_count: 0,
          total_minutes: 0,
        } as any, { onConflict: 'beta_tester_id,activity_date' });

      // Update daily minutes every 60 seconds
      intervalRef.current = setInterval(async () => {
        const todayNow = new Date().toISOString().split('T')[0];
        // Increment total_minutes by 1 each minute
        const { data: existing } = await supabase
          .from('beta_tester_daily_activity')
          .select('total_minutes')
          .eq('beta_tester_id', tester.id)
          .eq('activity_date', todayNow)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('beta_tester_daily_activity')
            .update({ total_minutes: (existing.total_minutes || 0) + 1 } as any)
            .eq('beta_tester_id', tester.id)
            .eq('activity_date', todayNow);
        }

        // Update aggregate on beta_testers
        await supabase
          .from('beta_testers')
          .update({
            total_session_minutes: (await getTotal(tester.id)),
            last_active_at: new Date().toISOString(),
          } as any)
          .eq('id', tester.id);
      }, 60000);
    };

    startTracking();

    // End session on unmount/close
    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);

      // End session
      if (sessionIdRef.current) {
        supabase
          .from('beta_tester_sessions')
          .update({ session_end: new Date().toISOString() } as any)
          .eq('id', sessionIdRef.current)
          .then(() => {});
      }

      // Update active_days_count
      if (betaTesterIdRef.current) {
        supabase
          .from('beta_tester_daily_activity')
          .select('activity_date')
          .eq('beta_tester_id', betaTesterIdRef.current)
          .then(({ data }) => {
            if (data) {
              supabase
                .from('beta_testers')
                .update({ active_days_count: data.length } as any)
                .eq('id', betaTesterIdRef.current!)
                .then(() => {});
            }
          });
      }
    };
  }, [user]);
};

async function getTotal(betaTesterId: string): Promise<number> {
  const { data } = await supabase
    .from('beta_tester_daily_activity')
    .select('total_minutes')
    .eq('beta_tester_id', betaTesterId);

  return (data || []).reduce((sum, r) => sum + (r.total_minutes || 0), 0);
}
