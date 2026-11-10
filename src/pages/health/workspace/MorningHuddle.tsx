import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Square, Sunrise } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VOICE_RATES } from '@/lib/clinical/kayla-workspace-voice';
import { SILENT_AUDIO, kaylaHuddlePart } from '../kayla-voice';

export const HUDDLE_VOICE_PROBLEM = "Kayla's voice couldn't start just now. Please try Play huddle again in a moment.";

/** Kayla's spoken morning huddle in her own voice. The voice service builds the words itself from
 * this clinic's test-patient counts (never names); the browser sends no text to be spoken. */
export default function MorningHuddle({ clinicId }: { clinicId: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'speaking' | 'paused'>('idle');
  const [rate, setRate] = useState<number>(1);
  const [script, setScript] = useState('');
  const [error, setError] = useState('');
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
        let current = await kaylaHuddlePart(clinicId, 0);
        if (!live()) return;
        if (current.text) setScript(current.text);
        const total = current.parts;
        for (let n = 0; n < total; n++) {
          if (!live()) return;
          // Prepare the next piece while this one plays, so Kayla keeps talking.
          const next = n + 1 < total ? kaylaHuddlePart(clinicId, n + 1) : null;
          next?.catch(() => undefined);
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

  return <section aria-label="Morning huddle" className="mb-6 rounded-lg border border-mansagold/40 bg-mansagold/5 p-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2"><Sunrise className="h-5 w-5 text-mansagold" /><div><p className="font-semibold">Morning huddle with Kayla</p><p className="text-xs text-muted-foreground">About 45 seconds · test patients only · in Kayla's voice, counts only (no names)</p></div></div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1" aria-label="Speaking speed">{VOICE_RATES.map(r => <Button key={r} size="sm" variant={rate === r ? 'default' : 'outline'} aria-pressed={rate === r} onClick={() => setRate(r)}>{r}×</Button>)}</div>
        {state === 'idle' && <Button size="sm" variant="clinicalHelp" onClick={play}><Play />Play huddle</Button>}
        {state === 'loading' && <Button size="sm" disabled>Kayla is getting ready…</Button>}
        {state === 'speaking' && <Button size="sm" variant="outline" onClick={pause}><Pause />Pause</Button>}
        {state === 'paused' && <Button size="sm" variant="outline" onClick={resume}><Play />Resume</Button>}
        {state !== 'idle' && <Button size="sm" variant="destructive" onClick={end}><Square />Stop</Button>}
      </div>
    </div>
    {script && <p className="mt-3 text-sm text-muted-foreground">{script}</p>}
    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
  </section>;
}
