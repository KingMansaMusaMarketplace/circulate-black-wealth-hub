// Talk-to-type for pilot visit notes (made-up test patients only).
// The browser records plain WAV audio, the private health-pilot-dictation
// service sends it straight to 1325.AI's own OpenAI account, and the words
// come back into the draft. Nothing is saved until the doctor clicks
// "Save draft", and nothing is ever signed automatically.

/** Longest single recording. Recording stops by itself at this point. */
export const DICTATION_MAX_SECONDS = 120;
/** Audio is reduced to 16 kHz mono before upload: clear speech, small file. */
export const DICTATION_SAMPLE_RATE = 16000;
/** WAV header + two minutes of 16-bit mono audio at 16 kHz, plus 1 s of slack. */
export const DICTATION_MAX_BYTES = 44 + (DICTATION_MAX_SECONDS + 1) * DICTATION_SAMPLE_RATE * 2;
/** Shorter than this is treated as "nothing was said". */
export const DICTATION_MIN_SECONDS = 0.5;
/** Same limit as each visit note section. */
export const NOTE_SECTION_MAX = 5000;
export const DICTATION_REMINDER = "Test patients only. Don't say real names.";
/** Longest spoken Ask Kayla question; mirrors QUESTION_MAX_SECONDS on the server. */
export const KAYLA_QUESTION_MAX_SECONDS = 30;
/** Ask Kayla question box limit; spoken words are cut to fit it. */
export const KAYLA_QUESTION_MAX_CHARS = 600;
export const KAYLA_MIC_REMINDER = "Ask about features only. Don't say patient names or details.";

/** Average neighbouring samples down to the target rate (mono). */
export function downsample(chunks: readonly Float32Array[], fromRate: number, toRate = DICTATION_SAMPLE_RATE): Float32Array {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const input = new Float32Array(total);
  let at = 0;
  for (const c of chunks) { input.set(c, at); at += c.length; }
  if (fromRate <= toRate) return input;
  const ratio = fromRate / toRate;
  const out = new Float32Array(Math.floor(total / ratio));
  for (let i = 0; i < out.length; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.min(total, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j++) sum += input[j];
    out[i] = end > start ? sum / (end - start) : 0;
  }
  return out;
}

/** 16-bit PCM mono WAV bytes. */
export function encodeWav(samples: Float32Array, sampleRate = DICTATION_SAMPLE_RATE): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(44 + samples.length * 2));
  const view = new DataView(bytes.buffer);
  const tag = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  tag(0, 'RIFF'); view.setUint32(4, 36 + samples.length * 2, true); tag(8, 'WAVE');
  tag(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  tag(36, 'data'); view.setUint32(40, samples.length * 2, true);
  let o = 44;
  for (const v of samples) { const s = Math.max(-1, Math.min(1, v)); view.setInt16(o, s < 0 ? s * 32768 : s * 32767, true); o += 2; }
  return bytes;
}

export const wavSeconds = (sampleCount: number, rate = DICTATION_SAMPLE_RATE) => sampleCount / rate;

/**
 * Adds spoken words after whatever the doctor already typed — never replaces it.
 * Text past the 5,000-character section limit is cut off and reported.
 */
export function appendDictation(existing: string, spoken: string, max = NOTE_SECTION_MAX): { text: string; added: boolean; truncated: boolean } {
  const words = spoken.replace(/\s+/g, ' ').trim();
  if (!words) return { text: existing, added: false, truncated: false };
  const base = existing.replace(/\s+$/, '');
  const joined = base ? `${base}${/[.!?:]$/.test(base) ? ' ' : base.endsWith('\n') ? '' : ' '}${words}` : words;
  if (joined.length <= max) return { text: joined, added: true, truncated: false };
  return { text: joined.slice(0, max), added: joined.slice(0, max).length > existing.length, truncated: true };
}

/** Plain-English message for a failed talk-to-type request. */
export function dictationErrorMessage(status: number, serverMessage?: string): string {
  if (serverMessage && serverMessage.length <= 200) return serverMessage;
  if (status === 401) return 'Please sign in again, then try talk-to-type.';
  if (status === 403) return 'Talk-to-type is only for members of this pilot clinic with a current viewing.';
  if (status === 413) return 'That recording was too long. Keep each recording under 2 minutes.';
  if (status === 429) return 'Too many recordings in a short time. Wait a minute and try again.';
  return 'Talk-to-type is not available right now. You can still type the note.';
}
