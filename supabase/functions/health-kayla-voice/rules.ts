// Rules for speaking Ask Kayla answers and the morning huddle in Kayla's own video voice.
import { KAYLA_VOICE_MAX_CHARS, spokenText } from '../_shared/clinical-spoken-text.ts';

/** Kayla's video voice in the 1325.AI HeyGen account ("Authoritative Consultant"). */
export const KAYLA_VOICE_ID = 'MyQI9BPZq1P9pJ3RS1q7';
export const HEYGEN_SPEECH_URL = 'https://api.heygen.com/v3/voices/speech';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Kayla starts talking after a short first piece (~5 s to prepare) while later pieces are prepared during playback. */
export const FIRST_PART_CHARS = 280;
export const PART_CHARS = 900;
export const MAX_PARTS = 16;

export type VoiceRequest = { clinicId: string; selection: unknown; receipt: unknown; part: number };
/** Exactly clinic_id + selection + receipt (+ optional piece number); nothing else (no free text) is accepted. */
export function parseVoiceRequest(body: unknown): VoiceRequest | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  const keys = Object.keys(b).sort().join(',');
  if (keys !== 'clinic_id,receipt,selection' && keys !== 'clinic_id,part,receipt,selection') return null;
  if (typeof b.clinic_id !== 'string' || !UUID.test(b.clinic_id)) return null;
  const part = b.part === undefined ? 0 : b.part;
  if (typeof part !== 'number' || !Number.isInteger(part) || part < 0 || part >= MAX_PARTS) return null;
  return { clinicId: b.clinic_id, selection: b.selection, receipt: b.receipt, part };
}

export type HuddleRequest = { clinicId: string; tzOffset: number; part: number; session: 'morning' | 'midday' | 'afternoon' };
/** The morning huddle: exactly clinic_id + huddle:true + the doctor's clock offset (+ optional piece number).
 * The service builds the words itself from the clinic's test-patient counts; no text is accepted. */
export function parseHuddleRequest(body: unknown): HuddleRequest | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  const keys = Object.keys(b).sort().join(',');
  const allowed = ['clinic_id,huddle,tz_offset', 'clinic_id,huddle,part,tz_offset', 'clinic_id,huddle,session,tz_offset', 'clinic_id,huddle,part,session,tz_offset'];
  if (!allowed.includes(keys)) return null;
  const session = b.session === undefined ? 'morning' : b.session;
  if (session !== 'morning' && session !== 'midday' && session !== 'afternoon') return null;
  if (b.huddle !== true || typeof b.clinic_id !== 'string' || !UUID.test(b.clinic_id)) return null;
  if (typeof b.tz_offset !== 'number' || !Number.isInteger(b.tz_offset) || Math.abs(b.tz_offset) > 840) return null;
  const part = b.part === undefined ? 0 : b.part;
  if (typeof part !== 'number' || !Number.isInteger(part) || part < 0 || part >= MAX_PARTS) return null;
  return { clinicId: b.clinic_id, tzOffset: b.tz_offset, part, session };
}

/** Splits the spoken words into pieces at sentence ends: a short first piece, then longer ones. */
export function speechParts(words: string, first = FIRST_PART_CHARS, rest = PART_CHARS): string[] {
  // Headings and list lines without an ending get a full stop so Kayla pauses after them.
  const sentences = words.split(/\n+/).map((l) => l.trim()).filter(Boolean)
    .map((l) => /[.!?:;,]$/.test(l) ? l : `${l}.`)
    .flatMap((l) => l.split(/(?<=[.!?:;])\s+/)).map((s) => s.trim()).filter(Boolean);
  const units: string[] = [];
  for (const sentence of sentences) {
    let s = sentence;
    while (s.length > rest) {
      let cut = s.lastIndexOf(' ', rest);
      if (cut < rest / 2) cut = rest;
      units.push(s.slice(0, cut).trim()); s = s.slice(cut).trim();
    }
    if (s) units.push(s);
  }
  const parts: string[] = [];
  let current = '';
  for (const unit of units) {
    const limit = parts.length === 0 ? first : rest;
    if (current && current.length + 1 + unit.length > limit) { parts.push(current); current = unit; }
    else current = current ? `${current} ${unit}` : unit;
  }
  if (current) parts.push(current);
  return parts;
}

/** Said after a long answer is cut short, so the doctor knows the rest is on screen. */
export const LONG_ANSWER_ENDING = 'The rest of my answer is written on your screen.';

/** Spoken words for a verified answer, or null when empty. A very long answer is read up to the
 * last full sentence that fits, then Kayla says the rest is on screen (instead of refusing to speak). */
export function speechFor(answer: string): string | null {
  const words = spokenText(answer).replace(/\n{3,}/g, '\n\n').trim();
  if (!words) return null;
  if (words.length <= KAYLA_VOICE_MAX_CHARS) return words;
  const room = words.slice(0, KAYLA_VOICE_MAX_CHARS - LONG_ANSWER_ENDING.length - 2);
  const end = Math.max(room.lastIndexOf('. '), room.lastIndexOf('.\n'), room.lastIndexOf('? '), room.lastIndexOf('! '));
  const kept = (end > room.length / 2 ? room.slice(0, end + 1) : room.slice(0, room.lastIndexOf(' '))).trim();
  return `${kept}\n${LONG_ANSWER_ENDING}`;
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

/** Counted per spoken piece (an average answer is 3–4 pieces). */
export const RATE_LIMIT = 150;
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
