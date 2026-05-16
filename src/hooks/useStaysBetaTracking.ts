import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Tracks session time + daily activity for Mansa Stays beta testers.
 * Silent — only activates if the current user is an active Stays beta tester.
 */
export const useStaysBetaTracking = () => {
  const { user } = useAuth();
  const sessionIdRef = useRef<string | null>(null);
  const testerIdRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      const { data: tester } = await supabase
        .from('stays_beta_testers' as any)
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (!tester || cancelled) return;
      testerIdRef.current = (tester as any).id;

      const { data: session } = await supabase
        .from('stays_beta_tester_sessions' as any)
        .insert({ beta_tester_id: (tester as any).id, user_id: user.id } as any)
        .select('id').single();

      if (session) sessionIdRef.current = (session as any).id;

      const today = new Date().toISOString().split('T')[0];
      await supabase.from('stays_beta_tester_daily_activity' as any).upsert({
        beta_tester_id: (tester as any).id,
        user_id: user.id,
        activity_date: today,
        page_views: 1,
        actions_count: 0,
        total_minutes: 0,
      } as any, { onConflict: 'beta_tester_id,activity_date' });

      intervalRef.current = setInterval(async () => {
        const td = new Date().toISOString().split('T')[0];
        const { data: existing } = await supabase
          .from('stays_beta_tester_daily_activity' as any)
          .select('total_minutes')
          .eq('beta_tester_id', (tester as any).id)
          .eq('activity_date', td)
          .maybeSingle();
        if (existing) {
          await supabase.from('stays_beta_tester_daily_activity' as any)
            .update({ total_minutes: ((existing as any).total_minutes || 0) + 1 } as any)
            .eq('beta_tester_id', (tester as any).id)
            .eq('activity_date', td);
        }
        await supabase.from('stays_beta_testers' as any)
          .update({ last_active_at: new Date().toISOString() } as any)
          .eq('id', (tester as any).id);
      }, 60000);
    })();

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (sessionIdRef.current) {
        supabase.from('stays_beta_tester_sessions' as any)
          .update({ session_end: new Date().toISOString() } as any)
          .eq('id', sessionIdRef.current)
          .then(() => {});
      }
    };
  }, [user]);
};
