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

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      try { URL.revokeObjectURL(audioRef.current.src); } catch { /* ignore */ }
      audioRef.current = null;
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

  const speak = useCallback(async (raw: string) => {
    const text = toSpeakableText(raw || '');
    if (!text || isNativeIOS) return;

    stop();
    setIsLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) return;

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'marin' },
      });

      // Edge function returns raw audio; supabase-js gives us a Blob here.
      const blob = data instanceof Blob ? data : null;
      if (error || !blob || blob.size === 0) return;

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };
      await audio.play();
    } catch {
      setIsSpeaking(false);
    } finally {
      setIsLoading(false);
    }
  }, [isNativeIOS, stop]);

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
    speak,
    speakOnce,
    stop,
    isSpeaking,
    isLoading,
  };
}
