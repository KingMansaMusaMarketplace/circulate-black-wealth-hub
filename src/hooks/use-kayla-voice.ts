import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Kayla voice replies.
 *
 * - Preference is remembered per browser and defaults to OFF.
 * - Signed-in users get Kayla's real (OpenAI) Marin voice via the
 *   text-to-speech edge function.
 * - Never enabled inside the native iOS app (voice stack is disabled there).
 */

const STORAGE_KEY = 'kayla_voice_replies';
const MAX_SPEAK_CHARS = 1000;

export const VOICE_REPLIES_STORAGE_KEY = STORAGE_KEY;

/** Turn markdown into plain speakable text. */
export function toSpeakableText(markdown: string): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[*_#>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= MAX_SPEAK_CHARS) return plain;
  const cut = plain.slice(0, MAX_SPEAK_CHARS);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  return (lastStop > 300 ? cut.slice(0, lastStop + 1) : cut) + ' You can read the rest on screen.';
}

function readStoredPreference(): boolean {
  try {
    // Voice replies are ON by default; only an explicit "off" disables them.
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function useKaylaVoice() {
  const isNativeIOS =
    typeof window !== 'undefined' && window.Capacitor?.getPlatform?.() === 'ios';

  const [enabled, setEnabledState] = useState<boolean>(() => !isNativeIOS && readStoredPreference());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spokenRef = useRef<Set<string>>(new Set());

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }
    return audioRef.current;
  }, []);

  // Browsers may block audio that begins after transcription and AI requests finish.
  // Prime the same audio element during the person's microphone/send interaction.
  const preparePlayback = useCallback(() => {
    if (isNativeIOS) return;
    const audio = getAudio();
    if (audio.src) return;
    audio.volume = 0;
    audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAACAgICA';
    void audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
    }).catch(() => {
      audio.volume = 1;
    });
  }, [getAudio, isNativeIOS]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current.src.startsWith('blob:')) {
        try { URL.revokeObjectURL(audioRef.current.src); } catch { /* ignore */ }
      }
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }
    try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    try { localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off'); } catch { /* ignore */ }
    if (!next) stop();
  }, [stop]);

  const speakWithBrowser = useCallback((text: string) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Prefer the most natural female voice the device offers.
      const voices = synth.getVoices?.() ?? [];
      const preferred = ['Samantha', 'Ava', 'Allison', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Karen', 'Moira'];
      const pick = preferred
        .map((n) => voices.find((v) => v.name.includes(n)))
        .find(Boolean);
      if (pick) utterance.voice = pick;
      utterance.rate = 0.98;
      utterance.pitch = 1.02;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synth.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  }, []);

  /** Ask the edge function for audio of a short piece of text. */
  const synthesize = useCallback(async (text: string): Promise<Blob | null> => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.access_token) return null;

    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text, voice: 'marin' },
    });

    if (error) {
      console.error('[KaylaVoice] text-to-speech error', error);
      return null;
    }

    const type = 'audio/ogg; codecs=opus';
    let blob: Blob | null = null;
    if (data instanceof Blob) {
      blob = new Blob([data], { type });
    } else if (data instanceof ArrayBuffer) {
      blob = new Blob([data], { type });
    } else if (data && typeof (data as Response).arrayBuffer === 'function') {
      blob = new Blob([await (data as Response).arrayBuffer()], { type });
    } else if (typeof data === 'string') {
      const base64 = data.replace(/^data:[^,]+,/, '');
      blob = new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], { type });
    } else if (data && typeof data === 'object' && 'audioContent' in (data as any)) {
      blob = new Blob([Uint8Array.from(atob((data as any).audioContent), (c) => c.charCodeAt(0))], { type });
    }

    if (!blob || blob.size === 0) {
      console.error('[KaylaVoice] no audio returned', data);
      return null;
    }
    return blob;
  }, []);

  /** Play one clip and resolve when it finishes. */
  const playBlob = useCallback((blob: Blob) => new Promise<void>((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = getAudio();
    const finish = () => {
      setIsSpeaking(false);
      try { URL.revokeObjectURL(url); } catch { /* ignore */ }
      resolve();
    };
    audio.src = url;
    audio.volume = 1;
    audio.onplay = () => setIsSpeaking(true);
    audio.onended = finish;
    audio.onerror = finish;
    audio.play().catch((err) => {
      console.error('[KaylaVoice] playback blocked', err);
      finish();
    });
  }), [getAudio]);

  const speak = useCallback(async (raw: string) => {
    const text = toSpeakableText(raw || '');
    if (!text || isNativeIOS) return;

    stop();
    setIsLoading(true);
    try {
      const blob = await synthesize(text);
      if (blob) await playBlob(blob);
    } catch (err) {
      console.error('[KaylaVoice] playback failed', err);
      setIsSpeaking(false);
    } finally {
      setIsLoading(false);
    }
  }, [isNativeIOS, playBlob, stop, synthesize]);

  // ---- Speak-as-she-writes -------------------------------------------------
  // While Kayla's answer is still streaming in, each finished sentence is sent
  // for speech right away and played in order, so she starts talking in a
  // couple of seconds instead of waiting for the whole answer.
  const streamRef = useRef({ active: false, cursor: 0, spoken: 0, queue: [] as string[], draining: false });

  const drainQueue = useCallback(async () => {
    const s = streamRef.current;
    if (s.draining) return;
    s.draining = true;
    try {
      while (s.queue.length) {
        const next = s.queue.shift()!;
        const blob = await synthesize(next);
        if (!blob) break;
        await playBlob(blob);
      }
    } catch (err) {
      console.error('[KaylaVoice] stream playback failed', err);
    } finally {
      s.draining = false;
      setIsLoading(false);
    }
  }, [playBlob, synthesize]);

  const enqueue = useCallback((chunk: string) => {
    const s = streamRef.current;
    const text = chunk.trim();
    if (!text) return;
    s.spoken += text.length;
    s.queue.push(text);
    void drainQueue();
  }, [drainQueue]);

  const beginStream = useCallback(() => {
    if (isNativeIOS) return;
    stop();
    streamRef.current = { active: true, cursor: 0, spoken: 0, queue: [], draining: false };
    setIsLoading(true);
  }, [isNativeIOS, stop]);

  /** Feed the full text received so far; finished sentences are spoken. */
  const pushStream = useCallback((fullSoFar: string) => {
    const s = streamRef.current;
    if (!s.active || s.spoken >= MAX_SPEAK_CHARS) return;
    const plain = toSpeakableText(fullSoFar);
    const pending = plain.slice(s.cursor);
    if (pending.length < 40) return;
    const stop1 = Math.max(pending.lastIndexOf('. '), pending.lastIndexOf('! '), pending.lastIndexOf('? '));
    if (stop1 < 20) return;
    const chunk = pending.slice(0, stop1 + 1);
    s.cursor += chunk.length;
    enqueue(chunk);
  }, [enqueue]);

  const endStream = useCallback((fullText: string) => {
    const s = streamRef.current;
    if (!s.active) return;
    const plain = toSpeakableText(fullText);
    const rest = plain.slice(s.cursor);
    s.active = false;
    if (rest.trim() && s.spoken < MAX_SPEAK_CHARS) {
      s.cursor = plain.length;
      enqueue(rest);
    } else if (!s.queue.length && !s.draining) {
      setIsLoading(false);
    }
  }, [enqueue]);

  const cancelStream = useCallback(() => {
    streamRef.current.active = false;
    streamRef.current.queue = [];
  }, []);

  /**
   * Speak a finished reply once — safe to call on every render.
   * `key` should identify the message (e.g. index + length).
   */
  const speakOnce = useCallback((key: string, text: string) => {
    if (!enabled || spokenRef.current.has(key)) return;
    spokenRef.current.add(key);
    void speak(text);
  }, [enabled, speak]);

  useEffect(() => () => { stop(); }, [stop]);

  return {
    available: !isNativeIOS,
    enabled,
    setEnabled,
    preparePlayback,
    speak,
    speakOnce,
    beginStream,
    pushStream,
    endStream,
    cancelStream,
    stop,
    isSpeaking,
    isLoading,
  };
}
