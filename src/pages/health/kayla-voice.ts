// Kayla's own video voice for Ask Kayla answers and the morning huddle (private clinic workspace only).
// The browser sends only the clinic, the question choice, Kayla's signed answer and a piece number;
// the server refuses anything Kayla did not write. Answers are spoken in pieces so Kayla starts
// talking within a few seconds; each piece is turned into audio once per viewing.
import { supabase } from '@/integrations/supabase/client';
import { clinicalRequestHeaders } from './clinical-request';
import type { HelpSelection } from '../../../supabase/functions/_shared/clinical-help-intake';

export type KaylaVoiceProof = { selection: HelpSelection; receipt: { text: string; proof: string } };
export type KaylaVoicePiece = { url: string; parts: number };

/** Seconds to wait for one piece of Kayla's voice before telling the doctor it could not start. */
export const KAYLA_VOICE_WAIT_SECONDS = 30;

// 20 ms of silence: played during a tap so phones (especially iPhone) allow Kayla's audio later.
export const SILENT_AUDIO = `data:audio/wav;base64,UklGRmQBAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUABAAA${'A'.repeat(427)}==`;

const made = new Map<string, Promise<KaylaVoicePiece>>();

async function requestPiece(clinicId: string, proof: KaylaVoiceProof, part: number): Promise<KaylaVoicePiece> {
  return post({ clinic_id: clinicId, selection: proof.selection, receipt: proof.receipt, part });
}

async function post(payload: Record<string, unknown>): Promise<KaylaVoicePiece & { text?: string }> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error('Signed out');
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), KAYLA_VOICE_WAIT_SECONDS * 1000);
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-kayla-voice`, {
      method: 'POST',
      signal: abort.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, 'x-csrf-token': 'clinical-kayla-voice', ...clinicalRequestHeaders() },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (body?.device_only === true) throw new DeviceVoiceOnly();
    if (!response.ok || typeof body.audio_url !== 'string') throw new VoiceRefused(response.status, typeof body.error === 'string' ? body.error : '');
    return { url: body.audio_url, parts: Math.max(1, Number(body.parts) || 1), ...(typeof body.text === 'string' ? { text: body.text } : {}) };
  } finally { clearTimeout(timer); }
}

/** One piece of an answer in Kayla's voice; repeated or overlapping requests share the same audio. */
export function kaylaVoicePart(clinicId: string, proof: KaylaVoiceProof, part: number): Promise<KaylaVoicePiece> {
  const key = `${proof.receipt.proof}#${part}`;
  const cached = made.get(key);
  if (cached) return cached;
  if (made.size >= 200) made.delete(made.keys().next().value as string);
  const pending = requestPiece(clinicId, proof, part);
  made.set(key, pending);
  pending.catch(() => { if (made.get(key) === pending) made.delete(key); });
  return pending;
}

/** One piece of the morning huddle in Kayla's voice. The service builds the words itself from this
 * clinic's test-patient counts; the browser sends only the clinic, its clock offset and a piece number. */
export function kaylaHuddlePart(clinicId: string, part: number, session: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning'): Promise<KaylaVoicePiece & { text?: string }> {
  return post({ clinic_id: clinicId, huddle: true, tz_offset: new Date().getTimezoneOffset(), part, ...(session === 'morning' ? {} : { session }) });
}

/** The voice service answered but would not speak; reason is its own short, fixed message (never answer words). */
export class VoiceRefused extends Error {
  readonly reason: string;
  constructor(readonly status: number, reason: string) {
    super(reason || `Voice request failed (${status})`); this.name = 'VoiceRefused';
    // Only short sentences the service writes itself are shown; anything else falls back to the general retry message.
    this.reason = reason.length <= 120 && /^[\w\s.,'’-]+$/.test(reason) && !/unavailable right now/i.test(reason) ? reason.trim() : '';
  }
}

/** The voice service said this chart must use the device voice (a real patient, or a clinic cleared for real patients). */
export class DeviceVoiceOnly extends Error { constructor() { super('Device voice only'); this.name = 'DeviceVoiceOnly'; } }

export type ReadBackOrder =
  | { readback: 'rx'; order: { drug_name: string; strength: string | null; dose: string; route: string; frequency: string; quantity: string; refills: string; days_supply: string; warnings: number } }
  | { readback: 'lab'; order: { test_name: string; priority: string; reason: string } };

/** One piece of an order read-back in Kayla's voice. The service builds the sentence itself from these
 * checked order fields and the test patient's own allergies; it refuses real patients. */
export function kaylaReadBackPart(clinicId: string, patientId: string, request: ReadBackOrder, part: number): Promise<KaylaVoicePiece & { text?: string }> {
  return post({ clinic_id: clinicId, patient_id: patientId, readback: request.readback, order: request.order, part });
}

/** For tests: forget audio made in this viewing. */
export const forgetKaylaVoice = () => made.clear();
