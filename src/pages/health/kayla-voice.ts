// Kayla's own video voice for Ask Kayla answers (private clinic workspace only).
// The browser sends only the clinic, the question choice and Kayla's signed answer; the server
// refuses anything Kayla did not write. Each answer is turned into audio once per viewing.
import { supabase } from '@/integrations/supabase/client';
import { clinicalRequestHeaders } from './clinical-request';
import type { HelpSelection } from '../../../supabase/functions/_shared/clinical-help-intake';

export type KaylaVoiceProof = { selection: HelpSelection; receipt: { text: string; proof: string } };

/** Seconds a doctor waits for Kayla's voice before the device voice reads the answer instead. */
export const KAYLA_VOICE_WAIT_SECONDS = 40;

// 20 ms of silence: played during a tap so phones (especially iPhone) allow Kayla's audio later.
export const SILENT_AUDIO = `data:audio/wav;base64,UklGRmQBAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUABAAA${'A'.repeat(427)}==`;

const made = new Map<string, string>();

export async function kaylaVoiceUrl(clinicId: string, proof: KaylaVoiceProof): Promise<string> {
  const cached = made.get(proof.receipt.proof);
  if (cached) return cached;
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error('Signed out');
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), KAYLA_VOICE_WAIT_SECONDS * 1000);
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-kayla-voice`, {
      method: 'POST',
      signal: abort.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, 'x-csrf-token': 'clinical-kayla-voice', ...clinicalRequestHeaders() },
      body: JSON.stringify({ clinic_id: clinicId, selection: proof.selection, receipt: proof.receipt }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || typeof body.audio_url !== 'string') throw new Error(typeof body.error === 'string' ? body.error : `Voice request failed (${response.status})`);
    if (made.size >= 50) made.delete(made.keys().next().value as string);
    made.set(proof.receipt.proof, body.audio_url);
    return body.audio_url;
  } finally { clearTimeout(timer); }
}

/** For tests: forget audio made in this viewing. */
export const forgetKaylaVoice = () => made.clear();
