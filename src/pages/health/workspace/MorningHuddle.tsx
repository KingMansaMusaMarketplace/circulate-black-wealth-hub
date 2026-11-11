import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Pause, Play, Repeat, Square, Sunrise } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VOICE_RATES, latestSession, type HuddleSession } from '@/lib/clinical/kayla-workspace-voice';
import { SILENT_AUDIO, kaylaHuddlePart } from '../kayla-voice';

type Session = HuddleSession;
/** Four huddles across 24 hours, at shift changes; each also reports patient updates since the one before. */
export const HUDDLE_OPTIONS: { key: Session; label: string; time: string; focus: string }[] = [
  { key: 'morning', label: 'Morning Huddle', time: '7:00 AM', focus: "Today's schedule, labs, notes and overnight updates" },
  { key: 'afternoon', label: 'Afternoon Huddle', time: '1:00 PM', focus: 'Progress, urgent labs and medication safety' },
  { key: 'evening', label: 'Evening Handoff', time: '7:00 PM', focus: 'Shift handoff: notes to sign and open labs' },
  { key: 'night', label: 'Night Huddle', time: '11:00 PM', focus: "Overnight watch and tomorrow's schedule" },
];
/** The most recent huddle for the given clock time (before 7 AM still belongs to last night's huddle). */
export function latestHuddle(now: Date): Session {
  return latestSession(now.getHours());
}
type PlayLog = { session: Session; at: number };
const LOG_KEY = 'hc-huddle-log';
const COLLAPSE_KEY = 'hc-huddle-collapsed';
const today = () => new Date().toDateString();
/** Only huddle names and play times are kept, on this device, for today. */
function readLog(): PlayLog[] {
  try { const v = JSON.parse(localStorage.getItem(LOG_KEY) || 'null'); return v && v.day === today() && Array.isArray(v.entries) ? v.entries.filter((e: PlayLog) => HUDDLE_OPTIONS.some(o => o.key === e.session) && typeof e.at === 'number').slice(0, 20) : []; } catch { return []; }
}
const clock = (t: number) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
export const HUDDLE_VOICE_PROBLEM = "Kayla's voice couldn't start just now. Please try Play huddle again in a moment.";

/** Kayla's spoken daily huddles in her own voice. The voice service builds the words itself from
 * this clinic's test-patient counts (never names); the browser sends no text to be spoken. */
export default function MorningHuddle({ clinicId }: { clinicId: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'speaking' | 'paused'>('idle');
  const [rate, setRate] = useState<number>(1);
  const [script, setScript] = useState('');
  const [error, setError] = useState('');
  const [session, setSession] = useState<Session>(() => latestHuddle(new Date()));
  const [collapsed, setCollapsed] = useState<boolean>(() => { try { return localStorage.getItem(COLLAPSE_KEY) !== 'open'; } catch { return true; } });
  const [log, setLog] = useState<PlayLog[]>(readLog);
  const toggle = () => setCollapsed(c => { const next = !c; try { localStorage.setItem(COLLAPSE_KEY, next ? 'closed' : 'open'); } catch { /* private mode */ } return next; });
  const record = (s: Session) => setLog(prev => { const entries = [{ session: s, at: Date.now() }, ...prev].slice(0, 20); try { localStorage.setItem(LOG_KEY, JSON.stringify({ day: today(), entries })); } catch { /* private mode */ } return entries; });
  const audio = useRef<HTMLAudioElement | null>(null);
  const token = useRef(0);
  const element = () => { if (!audio.current && typeof Audio !== 'undefined') audio.current = new Audio(); return audio.current; };
  const halt = () => { token.current++; const a = audio.current; if (a) { a.onended = null; a.onerror = null; a.pause(); } };
  useEffect(() => () => { halt(); if (audio.current) audio.current.src = ''; }, []);
  useEffect(() => { if (audio.current) audio.current.playbackRate = rate; }, [rate]);

  const play = () => {
    halt(); setError(''); setState('loading');
    const mine = token.current;
    const live = () => mine === token.current;
    // Phones only allow later audio from an element that first played during a tap.
    const a = element();
    if (a) { a.muted = true; a.src = SILENT_AUDIO; void Promise.resolve(a.play()).catch(() => undefined).finally(() => { if (live() && a.src === SILENT_AUDIO) { a.pause(); a.muted = false; } }); }
    const playPiece = (url: string) => new Promise<void>((resolve, reject) => {
      const el = element(); if (!el) { reject(new Error('No audio')); return; }
      el.muted = false; el.onended = () => resolve(); el.onerror = () => reject(new Error('Audio failed'));
      el.src = url; el.playbackRate = rate;
      Promise.resolve(el.play()).catch(reject);
    });
    void (async () => {
      try {
        let current = await kaylaHuddlePart(clinicId, 0, session);
        if (!live()) return;
        if (current.text) setScript(current.text);
        const total = current.parts;
        for (let n = 0; n < total; n++) {
          if (!live()) return;
          // Prepare the next piece while this one plays, so Kayla keeps talking.
          const next = n + 1 < total ? kaylaHuddlePart(clinicId, n + 1, session) : null;
          next?.catch(() => undefined);
          if (n === 0) record(session);
          setState('speaking');
          await playPiece(current.url);
          if (!next || !live()) break;
          current = await next;
        }
        if (live()) setState('idle');
      } catch { if (live()) { setState('idle'); setError(HUDDLE_VOICE_PROBLEM); } }
    })();
  };
  const pause = () => { audio.current?.pause(); setState('paused'); };
  const resume = () => { void Promise.resolve(audio.current?.play()).catch(() => undefined); setState('speaking'); };
  const end = () => { halt(); setState('idle'); };

  const latest = HUDDLE_OPTIONS.find(o => o.key === latestHuddle(new Date()))!;
  const chosen = HUDDLE_OPTIONS.find(o => o.key === session)!;
  const lastPlayed = log[0];
  const labelOf = (k: Session) => HUDDLE_OPTIONS.find(o => o.key === k)!.label;
  const controls = <div className="flex flex-wrap items-center gap-2">
    {!collapsed && <div className="flex gap-1" aria-label="Speaking speed">{VOICE_RATES.map(r => <Button key={r} size="sm" variant={rate === r ? 'default' : 'outline'} aria-pressed={rate === r} onClick={() => setRate(r)}>{r}×</Button>)}</div>}
    {state === 'idle' && <Button size="sm" variant="clinicalHelp" onClick={play}>{log.some(e => e.session === session) ? <><Repeat />Play huddle again</> : <><Play />Play huddle</>}</Button>}
    {state === 'loading' && <Button size="sm" disabled>Kayla is getting ready…</Button>}
    {state === 'speaking' && <Button size="sm" variant="outline" onClick={pause}><Pause />Pause</Button>}
    {state === 'paused' && <Button size="sm" variant="outline" onClick={resume}><Play />Resume</Button>}
    {state !== 'idle' && <Button size="sm" variant="destructive" onClick={end}><Square />Stop</Button>}
    <Button size="sm" variant="ghost" aria-expanded={!collapsed} aria-controls="kayla-huddle-details" aria-label={collapsed ? 'Show all huddles' : 'Hide huddles'} onClick={toggle}>{collapsed ? <ChevronDown /> : <ChevronUp />}<span className="hidden sm:inline">{collapsed ? 'Show all' : 'Hide'}</span></Button>
  </div>;

  return <section aria-label="Daily huddles with Kayla" className={`mb-6 rounded-lg border border-mansagold/40 bg-mansagold/5 ${collapsed ? 'px-4 py-3' : 'p-4'}`}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2"><Sunrise className="h-5 w-5 shrink-0 text-mansagold" /><div className="min-w-0">
        <p className="font-semibold">Daily huddles with Kayla</p>
        <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground"><Clock className="h-3 w-3" aria-hidden="true" />
          <span>Latest update: <span className="font-medium text-foreground">{latest.label} · {latest.time}</span></span>
          {lastPlayed && <span>· Last played {clock(lastPlayed.at)} ({labelOf(lastPlayed.session)})</span>}
          {collapsed && session !== latest.key && <span>· Selected: {chosen.label}</span>}
        </p>
      </div></div>
      {controls}
    </div>
    {collapsed && state !== 'idle' && script && <p className="mt-2 text-sm text-muted-foreground">{script}</p>}
    {!collapsed && <div id="kayla-huddle-details">
      <p className="mt-2 text-xs text-muted-foreground">Four huddles every 24 hours · each adds patient updates since the last one (new visits, check-ins, discharges, against-medical-advice departures, medicines and labs) · test patients only · in Kayla's voice, counts only (no names)</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label="Choose a huddle">{HUDDLE_OPTIONS.map(o => {
        const plays = log.filter(e => e.session === o.key);
        return <Button key={o.key} variant={session === o.key ? 'default' : 'outline'} aria-pressed={session === o.key} className="h-auto flex-col items-start whitespace-normal p-3 text-left" onClick={() => { end(); setScript(''); setError(''); setSession(o.key); }}>
          <span className="flex w-full items-center justify-between gap-2 font-semibold">{o.label}{o.key === latest.key && <span className="rounded-full bg-mansagold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Latest</span>}</span>
          <span className="text-xs opacity-80">{o.time} · {o.focus}</span>
          <span className="text-[11px] opacity-70">{plays.length ? `Played today at ${clock(plays[0].at)}${plays.length > 1 ? ` (${plays.length} times)` : ''}` : 'Not played yet today'}</span>
        </Button>;
      })}</div>
      {log.length > 0 && <details className="mt-3 text-xs text-muted-foreground"><summary className="cursor-pointer font-medium text-foreground">Today's huddle history ({log.length})</summary>
        <ul className="mt-2 space-y-1">{log.map(e => <li key={e.at}>{clock(e.at)} — {labelOf(e.session)}</li>)}</ul>
      </details>}
      {script && <p className="mt-3 text-sm text-muted-foreground">{script}</p>}
    </div>}
    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
  </section>;
}
