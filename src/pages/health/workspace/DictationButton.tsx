import { useEffect, useRef, useState } from 'react';
import { Loader2, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { clinicalRequestHeaders } from '../clinical-request';
import {
  DICTATION_MAX_SECONDS, DICTATION_MIN_SECONDS, DICTATION_SAMPLE_RATE, dictationErrorMessage, downsample, encodeWav, wavSeconds,
} from '@/lib/clinical/dictation';

type Recorder = { stream: MediaStream; context: AudioContext; source: MediaStreamAudioSourceNode; node: ScriptProcessorNode; chunks: Float32Array[] };
type Props = {
  clinicId: string; sectionLabel: string; disabled?: boolean; onText: (text: string) => void; onBusyChange?: (busy: boolean) => void; onError: (message: string) => void;
  /** 'question' = spoken Ask Kayla question (30-second limit on the server too). */
  purpose?: 'note' | 'question'; maxSeconds?: number; idleLabel?: string;
};

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** Microphone button for one visit-note section. Pilot test patients only. */
export default function DictationButton({ clinicId, sectionLabel, disabled, onText, onBusyChange, onError, purpose = 'note', maxSeconds = DICTATION_MAX_SECONDS, idleLabel = 'Talk to type' }: Props) {
  const [state, setState] = useState<'idle' | 'starting' | 'recording' | 'sending'>('idle');
  const [seconds, setSeconds] = useState(0);
  const rec = useRef<Recorder | null>(null);
  const timer = useRef<number | null>(null);
  const abort = useRef<AbortController | null>(null);
  const alive = useRef(true);
  const latest = useRef({ onText, onBusyChange, onError });
  latest.current = { onText, onBusyChange, onError };

  const release = () => {
    if (timer.current !== null) { window.clearInterval(timer.current); timer.current = null; }
    const r = rec.current; rec.current = null;
    if (!r) return null;
    r.node.onaudioprocess = null;
    try { r.source.disconnect(); r.node.disconnect(); } catch { /* already disconnected */ }
    r.stream.getTracks().forEach((t) => t.stop());
    void r.context.close().catch(() => undefined);
    return r;
  };
  const setBusy = (next: typeof state) => { if (!alive.current) return; setState(next); latest.current.onBusyChange?.(next !== 'idle'); };

  useEffect(() => {
    alive.current = true;
    // Leaving the tab, closing the note or signing out throws the recording away.
    const hidden = () => { if (document.hidden && rec.current) { release(); setBusy('idle'); latest.current.onError('Recording stopped because you left the page. Nothing was kept.'); } };
    document.addEventListener('visibilitychange', hidden);
    return () => { alive.current = false; document.removeEventListener('visibilitychange', hidden); release(); abort.current?.abort(); latest.current.onBusyChange?.(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async (r: Recorder) => {
    const samples = downsample(r.chunks, r.context.sampleRate, DICTATION_SAMPLE_RATE);
    if (wavSeconds(samples.length) < DICTATION_MIN_SECONDS) { setBusy('idle'); latest.current.onError("We didn't hear anything. Please record again."); return; }
    setBusy('sending');
    const controller = new AbortController(); abort.current = controller;
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) throw Object.assign(new Error(dictationErrorMessage(401)), { handled: true });
      const body = new FormData();
      body.append('clinic_id', clinicId);
      body.append('purpose', purpose);
      body.append('file', new Blob([encodeWav(samples)], { type: 'audio/wav' }), 'dictation.wav');
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-pilot-dictation`, {
        method: 'POST', body, signal: controller.signal,
        headers: { Authorization: `Bearer ${data.session.access_token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, 'x-csrf-token': 'clinical-pilot-dictation', ...clinicalRequestHeaders() },
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || typeof payload.text !== 'string') throw new Error(dictationErrorMessage(res.status, typeof payload.error === 'string' ? payload.error : undefined));
      if (alive.current) latest.current.onText(payload.text);
    } catch (e) {
      if (controller.signal.aborted || !alive.current) return;
      latest.current.onError(e instanceof Error && e.message ? e.message : dictationErrorMessage(0));
    } finally { if (abort.current === controller) abort.current = null; setBusy('idle'); }
  };

  const stop = () => { const r = release(); if (r) void send(r); };

  const start = async () => {
    if (state !== 'idle') return;
    if (!navigator.mediaDevices?.getUserMedia) { onError('This browser cannot use the microphone. Try Chrome or Safari.'); return; }
    setBusy('starting');
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
      if (!alive.current) { stream.getTracks().forEach((t) => t.stop()); return; }
      const context = new AudioContext();
      await context.resume();
      const source = context.createMediaStreamSource(stream);
      const node = context.createScriptProcessor(4096, 1, 1);
      const chunks: Float32Array[] = [];
      node.onaudioprocess = (ev) => chunks.push(new Float32Array(ev.inputBuffer.getChannelData(0)));
      source.connect(node); node.connect(context.destination);
      rec.current = { stream, context, source, node, chunks };
      const began = Date.now();
      setSeconds(0); setBusy('recording');
      timer.current = window.setInterval(() => {
        const s = (Date.now() - began) / 1000;
        setSeconds(s);
        if (s >= maxSeconds) stop();
      }, 250);
    } catch (e) {
      stream?.getTracks().forEach((t) => t.stop());
      release(); setBusy('idle');
      const denied = e instanceof DOMException && (e.name === 'NotAllowedError' || e.name === 'SecurityError');
      onError(denied ? 'Microphone access is blocked. Allow the microphone in your browser settings, then try again.' : 'The microphone could not start. Check that one is connected and try again.');
    }
  };

  if (state === 'recording') {
    return <Button type="button" size="sm" variant="destructive" onClick={stop} aria-label={`Stop recording ${sectionLabel}`}>
      <Square className="mr-1 h-3 w-3" />Stop · {clock(seconds)} / {clock(maxSeconds)}
    </Button>;
  }
  return <Button type="button" size="sm" variant="outline" disabled={disabled || state !== 'idle'} onClick={() => void start()} aria-label={`${idleLabel} ${sectionLabel}`}>
    {state === 'idle' ? <Mic className="mr-1 h-3 w-3" /> : <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
    {state === 'sending' ? 'Turning words into text…' : state === 'starting' ? 'Starting microphone…' : idleLabel}
  </Button>;
}
