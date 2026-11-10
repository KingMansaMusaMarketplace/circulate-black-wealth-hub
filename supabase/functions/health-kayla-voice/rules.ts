// Rules for speaking Ask Kayla answers in Kayla's own video voice.
import { KAYLA_VOICE_MAX_CHARS, spokenText } from '../_shared/clinical-spoken-text.ts';

/** Kayla's video voice in the 1325.AI HeyGen account ("Authoritative Consultant"). */
export const KAYLA_VOICE_ID = 'MyQI9BPZq1P9pJ3RS1q7';
export const HEYGEN_SPEECH_URL = 'https://api.heygen.com/v3/voices/speech';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type VoiceRequest = { clinicId: string; selection: unknown; receipt: unknown };
/** Exactly clinic_id + selection + receipt; nothing else (no free text) is accepted. */
export function parseVoiceRequest(body: unknown): VoiceRequest | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  if (Object.keys(b).sort().join(',') !== 'clinic_id,receipt,selection') return null;
  if (typeof b.clinic_id !== 'string' || !UUID.test(b.clinic_id)) return null;
  return { clinicId: b.clinic_id, selection: b.selection, receipt: b.receipt };
}

/** Spoken words for a verified answer, or null when too long or empty (the browser then uses the device voice). */
export function speechFor(answer: string): string | null {
  const words = spokenText(answer).replace(/\n{3,}/g, '\n\n').trim();
  if (!words || words.length > KAYLA_VOICE_MAX_CHARS) return null;
  return words;
}

export function speechPayload(words: string, voiceId = KAYLA_VOICE_ID) {
  return { voice_id: voiceId, text: words };
}

/** Only HeyGen's own audio addresses are passed back to the browser. */
export function safeAudioUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && /(^|\.)heygen\.(ai|com)$/.test(url.hostname) ? url.toString() : null;
  } catch { return null; }
}

export const RATE_LIMIT = 20;
export const RATE_WINDOW_MS = 10 * 60 * 1000;
export function makeRateLimiter(limit = RATE_LIMIT, windowMs = RATE_WINDOW_MS) {
  const hits = new Map<string, number[]>();
  return (userId: string, now = Date.now()): boolean => {
    const recent = (hits.get(userId) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) { hits.set(userId, recent); return false; }
    recent.push(now); hits.set(userId, recent);
    return true;
  };
}
