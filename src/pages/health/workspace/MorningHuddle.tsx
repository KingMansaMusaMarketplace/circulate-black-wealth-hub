import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Square, Sunrise } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from './hc';
import { huddleScript, speakOnDevice, VOICE_RATES, type HuddleCounts } from '@/lib/clinical/kayla-workspace-voice';

/** Kayla's spoken morning huddle: counts from the pilot test-patient tables, spoken on this device only. */
export default function MorningHuddle({ clinicId }: { clinicId: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'speaking' | 'paused'>('idle');
  const [rate, setRate] = useState<number>(1);
  const [script, setScript] = useState('');
  const [error, setError] = useState('');
  const stop = useRef<() => void>(() => {});
  useEffect(() => () => stop.current(), []);

  const load = async (): Promise<HuddleCounts> => {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    const [appts, labs, notes] = await Promise.all([
      db.from('hc_pilot_appointments').select('status').eq('clinic_id', clinicId).gte('starts_at', start.toISOString()).lt('starts_at', end.toISOString()),
      db.from('hc_pilot_lab_orders').select('status, priority').eq('clinic_id', clinicId).in('status', ['ordered', 'collected']),
      db.from('hc_pilot_visit_notes').select('status').eq('clinic_id', clinicId).eq('status', 'draft'),
    ]);
    if (appts.error || labs.error || notes.error) throw new Error('load');
    const a = (appts.data ?? []) as { status: string }[];
    const l = (labs.data ?? []) as { priority: string }[];
    return {
      visitsToday: a.filter(x => x.status !== 'cancelled').length,
      checkedIn: a.filter(x => x.status === 'checked_in').length,
      openLabs: l.length, urgentLabs: l.filter(x => x.priority !== 'routine').length,
      draftNotes: (notes.data ?? []).length,
    };
  };

  const play = async () => {
    setError(''); setState('loading');
    try {
      const text = huddleScript(await load());
      setScript(text); setState('speaking');
      stop.current = speakOnDevice(text, { rate, onEnd: () => setState('idle') });
    } catch { setState('idle'); setError('The huddle could not be prepared. Try again.'); }
  };
  const pause = () => { window.speechSynthesis?.pause(); setState('paused'); };
  const resume = () => { window.speechSynthesis?.resume(); setState('speaking'); };
  const end = () => { stop.current(); setState('idle'); };

  return <section aria-label="Morning huddle" className="mb-6 rounded-lg border border-mansagold/40 bg-mansagold/5 p-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2"><Sunrise className="h-5 w-5 text-mansagold" /><div><p className="font-semibold">Morning huddle with Kayla</p><p className="text-xs text-muted-foreground">About 45 seconds · test patients only · spoken on this device, nothing sent</p></div></div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1" aria-label="Speaking speed">{VOICE_RATES.map(r => <Button key={r} size="sm" variant={rate === r ? 'default' : 'outline'} aria-pressed={rate === r} onClick={() => setRate(r)} disabled={state !== 'idle'}>{r}×</Button>)}</div>
        {state === 'idle' && <Button size="sm" variant="clinicalHelp" onClick={() => void play()}><Play />Play huddle</Button>}
        {state === 'loading' && <Button size="sm" disabled>Preparing…</Button>}
        {state === 'speaking' && <Button size="sm" variant="outline" onClick={pause}><Pause />Pause</Button>}
        {state === 'paused' && <Button size="sm" variant="outline" onClick={resume}><Play />Resume</Button>}
        {(state === 'speaking' || state === 'paused') && <Button size="sm" variant="destructive" onClick={end}><Square />Stop</Button>}
      </div>
    </div>
    {script && <p className="mt-3 text-sm text-muted-foreground">{script}</p>}
    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
  </section>;
}
