import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Pause, Play, RefreshCw, Undo2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AutopilotFix {
  id: string;
  question: string;
  proposed_rule: string;
  status: 'pending' | 'approved' | 'rejected';
  autopilot_status: string | null;
  autopilot_note: string | null;
  auto_applied: boolean;
  auto_applied_at: string | null;
  score: number | null;
  created_at: string;
}

interface AutopilotRun {
  id: string;
  run_label: string | null;
  kind: string;
  started_at: string;
  finished_at: string | null;
  average_score: number | null;
  passed: number | null;
  cases_run: number;
}

interface AutopilotStatus {
  state: {
    enabled: boolean;
    paused_reason: string | null;
    last_daily_on: string | null;
    last_weekly_on: string | null;
    last_tick_at: string | null;
    last_tick_note: string | null;
    last_email_at: string | null;
  } | null;
  proposals: AutopilotFix[];
  runs: AutopilotRun[];
  auto_fixes_this_week: number;
  weekly_limit: number;
}

const FIX_LABEL: Record<string, string> = {
  trialing: 'Proof re-test running',
  kept: 'Live — kept after proof',
  discarded: 'Thrown away — failed proof',
  needs_approval: 'Waiting for you',
  disabled: 'Switched off — failed again',
  undone: 'Undone by you',
};

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : '—');

/** Kayla Autopilot: daily/weekly self-checks and proof-gated fixes, with pause and undo. */
export const KaylaAutopilotCard: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<AutopilotStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const call = useCallback(async (body: Record<string, unknown>) => {
    const { data: res, error } = await supabase.functions.invoke('kayla-autopilot', { body });
    if (error) throw new Error(error.message);
    if (res?.error) throw new Error(res.error);
    return res;
  }, []);

  const load = useCallback(async () => {
    try {
      setData(await call({ action: 'status' }));
    } catch (e) {
      toast({ title: 'Could not load the autopilot', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [call, toast]);

  useEffect(() => { load(); }, [load]);

  const act = async (key: string, body: Record<string, unknown>, done: string) => {
    setBusy(key);
    try {
      await call(body);
      toast({ title: done });
      await load();
    } catch (e) {
      toast({ title: 'That did not work', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setBusy(null);
    }
  };

  const state = data?.state;
  const on = !!state?.enabled && !state?.paused_reason;

  return (
    <Card className="bg-white/10 border-white/20 p-5 mt-8">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-mansagold" /> Kayla Autopilot
            {!loading && (
              <Badge className={on ? 'bg-emerald-600 text-white' : 'bg-white/20 text-white'}>
                {on ? 'On' : state?.paused_reason ? 'Paused' : 'Off'}
              </Badge>
            )}
          </h2>
          <p className="text-base text-white/80 mt-1 max-w-2xl">
            Every morning Kayla answers 12 rotating test questions; every Sunday night she answers all of them.
            When a question fails she tries one fix and keeps it only if the failed question now passes and
            nothing else gets worse. Clinical, money, legal and patent fixes — and any fix that adds new facts —
            always wait for you. At most {data?.weekly_limit ?? 3} automatic fixes in any 7 days.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {on ? (
            <Button variant="outline" disabled={!!busy} onClick={() => act('pause', { action: 'pause' }, 'Autopilot turned off')}
              className="border-white/30 text-white bg-transparent hover:bg-white/10">
              <Pause className="h-4 w-4 mr-2" /> Turn off
            </Button>
          ) : (
            <Button disabled={!!busy || loading} onClick={() => act('resume', { action: 'resume' }, 'Autopilot turned on')}
              className="bg-mansagold text-black hover:bg-mansagold/90">
              <Play className="h-4 w-4 mr-2" /> {state?.paused_reason ? 'Resume' : 'Turn on'}
            </Button>
          )}
          <Button variant="outline" disabled={!!busy} onClick={load} className="border-white/30 text-white bg-transparent hover:bg-white/10">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {state?.paused_reason && (
        <p className="text-base text-mansagold mb-4"><span className="font-semibold">Why it paused:</span> {state.paused_reason}</p>
      )}

      {state && (
        <div className="grid sm:grid-cols-3 gap-3 mb-5 text-sm text-white/85">
          <div className="rounded-lg bg-black/30 border border-white/15 p-3">
            <p className="font-semibold text-white">Last daily check</p>
            <p>{state.last_daily_on ?? 'Not yet'}</p>
          </div>
          <div className="rounded-lg bg-black/30 border border-white/15 p-3">
            <p className="font-semibold text-white">Last full test</p>
            <p>{state.last_weekly_on ?? 'Not yet'}</p>
          </div>
          <div className="rounded-lg bg-black/30 border border-white/15 p-3">
            <p className="font-semibold text-white">Automatic fixes this week</p>
            <p>{data?.auto_fixes_this_week ?? 0} of {data?.weekly_limit ?? 3}</p>
          </div>
          <p className="sm:col-span-3 text-white/70">
            Last looked: {when(state.last_tick_at)}{state.last_tick_note ? ` — ${state.last_tick_note}` : ''}
            {state.last_email_at ? ` · Last email to you: ${when(state.last_email_at)}` : ''}
          </p>
        </div>
      )}

      <h3 className="text-base font-bold text-white mb-2">Fixes the autopilot tried</h3>
      {!loading && !data?.proposals.length && (
        <p className="text-white/70 text-base mb-4">None yet. The first daily check runs tomorrow morning.</p>
      )}
      <div className="space-y-3 mb-5">
        {data?.proposals.map((p) => (
          <div key={p.id} className="border border-white/20 rounded-lg p-4 bg-black/30">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-bold text-base text-white">{p.question}</p>
              <Badge className={p.autopilot_status === 'kept' ? 'bg-emerald-600 text-white' : 'bg-white/15 text-white'}>
                {FIX_LABEL[p.autopilot_status ?? ''] ?? p.status}
              </Badge>
            </div>
            <p className="text-base text-mansagold mt-2"><span className="font-semibold">Fix:</span> {p.proposed_rule}</p>
            {p.autopilot_note && <p className="text-sm text-white/80 mt-1">{p.autopilot_note}</p>}
            {p.auto_applied && p.status === 'approved' && (
              <Button size="sm" variant="outline" disabled={busy === p.id}
                onClick={() => act(p.id, { action: 'undo', proposal_id: p.id }, 'Fix undone — Kayla stops using it within about 5 minutes')}
                className="mt-3 border-white/30 text-white bg-transparent hover:bg-white/10">
                <Undo2 className="h-4 w-4 mr-1" /> Undo this fix
              </Button>
            )}
          </div>
        ))}
      </div>

      {!!data?.runs.length && (
        <>
          <h3 className="text-base font-bold text-white mb-2">Recent automatic tests</h3>
          <ul className="text-sm text-white/85 space-y-1">
            {data.runs.map((r) => (
              <li key={r.id}>
                {r.run_label || r.kind} — {r.finished_at ? `${r.average_score ?? '—'}/100, ${r.passed ?? 0} of ${r.cases_run} passed` : 'running…'}
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
};

export default KaylaAutopilotCard;
