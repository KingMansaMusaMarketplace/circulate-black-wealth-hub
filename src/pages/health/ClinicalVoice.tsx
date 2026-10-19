import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play, Square, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/1325-ai-logo.png';
import { narrationCatalog, visitorAnnouncement } from './clinical-narration';

const assets = import.meta.glob<{ url: string }>('/src/assets/clinical-voice/*.asset.json', { eager: true, import: 'default' });
const catalog = narrationCatalog();
type Voice = { enabled: boolean; toggle: () => void; play: (id: string) => void; stop: () => void; pause: () => void; resume: () => void; current: string | null; paused: boolean; playing: boolean; error: string };
const Context = createContext<Voice | null>(null);
export const useClinicalVoice = () => useContext(Context);

export function ClinicalVoiceProvider({ children, remaining, extended, isAdmin }: { children: ReactNode; remaining: number; extended: boolean; isAdmin: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const audio = useRef<HTMLAudioElement | null>(null);
  const warned = useRef(false);
  const priorExtension = useRef(false);
  const stop = () => { const old = audio.current; audio.current = null; if (old) { old.pause(); old.src = ''; } setPlaying(false); setPaused(false); };
  const play = (id: string) => {
    if (!enabled) return;
    const clip = catalog.find(item => item.id === id);
    const asset = assets[`/src/assets/clinical-voice/${id}.mp3.asset.json`];
    stop(); setError('');
    if (!clip || !asset) { setError('This narration is unavailable.'); return; }
    setCurrent(id);
    const next = new Audio(asset.url); audio.current = next;
    next.onended = () => { if (audio.current === next) { setPlaying(false); setPaused(false); } };
    next.onerror = () => { if (audio.current === next) { setPlaying(false); setError('Audio could not play. The written narration remains available.'); } };
    void next.play().then(() => { if (audio.current === next) setPlaying(true); }).catch(() => { if (audio.current === next) { setPlaying(false); setError('Audio could not start. Select Play to try again.'); } });
  };
  useEffect(() => () => { audio.current?.pause(); if (audio.current) audio.current.src = ''; audio.current = null; }, []);
  useEffect(() => {
    const visibility = () => { if (document.hidden) { audio.current?.pause(); setPaused(true); setPlaying(false); } };
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);
  useEffect(() => {
    if (isAdmin) return;
    const newExtension = extended && !priorExtension.current;
    priorExtension.current = extended;
    if (newExtension) warned.current = false;
    const id = visitorAnnouncement(remaining, newExtension, warned.current);
    if (!enabled || !id) return;
    if (id === 'time-warning') warned.current = true;
    play(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, extended, enabled, isAdmin]);
  const voice: Voice = {
    enabled, current, paused, playing, error, play, stop,
    toggle: () => { if (enabled) stop(); setEnabled(!enabled); },
    pause: () => { audio.current?.pause(); setPaused(true); setPlaying(false); },
    resume: () => { const active = audio.current; if (!active) return; void active.play().then(() => { if (audio.current === active) { setPaused(false); setPlaying(true); } }).catch(() => setError('Audio could not resume.')); },
  };
  return <Context.Provider value={voice}>{children}</Context.Provider>;
}

export default function ClinicalVoiceGuide({ tourId }: { tourId?: string }) {
  const voice = useClinicalVoice();
  const [selection, setSelection] = useState('source-visit-back-pain-v1');
  useEffect(() => { if (tourId) voice?.play(`tour-${tourId}`); else voice?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);
  if (!voice) return null;
  const clip = catalog.find(item => item.id === voice.current);
  const selected = catalog.find(item => item.id === selection);
  const speakId = tourId ? `tour-${tourId}` : selection;
  return <div className="mt-4 border-t border-border pt-4 space-y-3" aria-label="Kayla voice guide">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2"><img src={logo} alt="1325.AI" className="h-8 w-8 object-contain" /><div><p className="text-sm font-semibold">Kayla · AI voice guide</p><p className="text-xs text-muted-foreground">Fictional rehearsal · {voice.enabled ? 'Sound enabled' : 'Sound off'}</p></div></div>
      <div className="flex gap-1">
        <Button variant="outline" size="icon" aria-label={voice.enabled ? 'Mute narration' : 'Enable sound'} title={voice.enabled ? 'Mute narration' : 'Enable sound'} onClick={voice.toggle}>{voice.enabled ? <Volume2 /> : <VolumeX />}</Button>
        <Button variant="outline" size="icon" disabled={!voice.enabled} aria-label={voice.playing ? 'Pause narration' : 'Play narration'} title={voice.playing ? 'Pause narration' : 'Play narration'} onClick={() => voice.playing ? voice.pause() : voice.paused ? voice.resume() : voice.play(speakId)}>{voice.playing ? <Pause /> : <Play />}</Button>
        <Button variant="ghost" size="icon" disabled={!voice.current} aria-label="Stop narration" title="Stop narration" onClick={voice.stop}><Square /></Button>
      </div>
    </div>
    <label className="block text-xs text-muted-foreground">Sample evidence or illustrative handoff
      <select aria-label="Narration selection" value={selection} onChange={e => { voice.stop(); setSelection(e.target.value); }} className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground">
        <optgroup label="Exact fictional transcripts">{catalog.filter(item => item.kind === 'source').map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</optgroup>
        <optgroup label="Illustrative assistant handoffs">{catalog.filter(item => item.kind === 'handoff').map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</optgroup>
      </select>
    </label>
    <Button variant="outline" disabled={!voice.enabled} onClick={() => voice.play(selection)}><Play className="h-4 w-4" />{selected?.kind === 'handoff' ? 'Hear illustrative handoff' : 'Read fictional source'}</Button>
    {selected?.kind === 'handoff' && <p className="text-xs text-primary">{selected.title} → Kayla · illustrative only, no employee action performed</p>}
    <div aria-label="Written narration" className="max-h-40 overflow-y-auto text-sm leading-relaxed text-muted-foreground"><p className="mb-1 text-xs font-semibold text-primary">{clip?.kind === 'source' ? 'Exact fictional source · numbered lines' : clip?.kind === 'handoff' ? 'Illustrative handoff · explanation' : 'Kayla explanation'}{clip ? ` · ${clip.title}` : ''}</p>{clip?.text ?? 'Select a fictional source or start the walkthrough.'}</div>
    {voice.error && <p role="alert" className="text-sm text-destructive">{voice.error}</p>}
  </div>;
}
