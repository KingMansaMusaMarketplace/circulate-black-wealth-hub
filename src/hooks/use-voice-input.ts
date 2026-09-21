import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Record a short voice message and turn it into text.
 *
 * Uses the browser microphone + the `transcribe-audio` edge function (Whisper).
 * Requires a signed-in user (the edge function is auth-guarded).
 */
export function useVoiceInput(onText: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const supported =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined';

  const toBase64 = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = String(reader.result || '');
        resolve(result.split(',')[1] || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') rec.stop();
    setIsRecording(false);
  }, []);

  const start = useCallback(async () => {
    if (!supported) {
      setError('Your browser cannot record audio.');
      return;
    }
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.access_token) {
        setError('Please sign in to talk to Kayla.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size < 1200) return; // nothing meaningful captured

        setIsTranscribing(true);
        try {
          const base64 = await toBase64(blob);
          const { data, error: fnError } = await supabase.functions.invoke('transcribe-audio', {
            body: { audio: base64 },
          });
          const text = (data as { text?: string } | null)?.text?.trim();
          if (fnError || !text) {
            setError("I couldn't catch that — try again.");
            return;
          }
          onText(text);
        } catch {
          setError("I couldn't catch that — try again.");
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setError('Microphone access was blocked.');
      setIsRecording(false);
    }
  }, [onText, supported]);

  const toggle = useCallback(() => {
    if (isRecording) stop();
    else void start();
  }, [isRecording, start, stop]);

  return { supported, isRecording, isTranscribing, error, start, stop, toggle };
}
