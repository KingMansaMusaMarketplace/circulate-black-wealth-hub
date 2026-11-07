// Pure checks for pilot talk-to-type. Mirrors src/lib/clinical/dictation.ts limits.
export const SAMPLE_RATE = 16000;
export const MAX_SECONDS = 120;
export const MIN_SECONDS = 0.5;
export const MAX_BYTES = 44 + (MAX_SECONDS + 1) * SAMPLE_RATE * 2;
/** Recordings per signed-in person per 10 minutes. */
export const RATE_LIMIT = 30;
export const RATE_WINDOW_MS = 10 * 60 * 1000;

/** Accept only the 16 kHz mono 16-bit WAV the pilot screen produces, within the time limits. */
export function checkWav(bytes: Uint8Array): { ok: true; seconds: number } | { ok: false; error: string } {
  if (bytes.length > MAX_BYTES) return { ok: false, error: 'That recording was too long. Keep each recording under 2 minutes.' };
  if (bytes.length < 44) return { ok: false, error: "We didn't hear anything. Please record again." };
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tag = (o: number) => String.fromCharCode(bytes[o], bytes[o + 1], bytes[o + 2], bytes[o + 3]);
  if (tag(0) !== 'RIFF' || tag(8) !== 'WAVE' || tag(12) !== 'fmt ' || tag(36) !== 'data'
    || view.getUint16(20, true) !== 1 || view.getUint16(22, true) !== 1
    || view.getUint32(24, true) !== SAMPLE_RATE || view.getUint16(34, true) !== 16) {
    return { ok: false, error: 'This recording format is not supported. Please refresh the page and try again.' };
  }
  const dataBytes = Math.min(view.getUint32(40, true), bytes.length - 44);
  const seconds = dataBytes / (SAMPLE_RATE * 2);
  if (seconds < MIN_SECONDS) return { ok: false, error: "We didn't hear anything. Please record again." };
  if (seconds > MAX_SECONDS + 1) return { ok: false, error: 'That recording was too long. Keep each recording under 2 minutes.' };
  return { ok: true, seconds };
}

/** Simple per-person limit (resets when the service restarts). */
export function makeRateLimiter(limit = RATE_LIMIT, windowMs = RATE_WINDOW_MS) {
  const hits = new Map<string, number[]>();
  return (userId: string, now = Date.now()): boolean => {
    const recent = (hits.get(userId) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) { hits.set(userId, recent); return false; }
    recent.push(now); hits.set(userId, recent);
    return true;
  };
}

/** Requests must be tagged to the organization named in the OpenAI BAA request. */
export function openAiHeaders(key: string, org?: string | null, project?: string | null): Record<string, string> | null {
  if (!key || !org || !/^org-[A-Za-z0-9]+$/.test(org)) return null;
  const headers: Record<string, string> = { Authorization: `Bearer ${key}`, 'OpenAI-Organization': org };
  if (project && /^proj_[A-Za-z0-9]+$/.test(project)) headers['OpenAI-Project'] = project;
  return headers;
}
