// Kayla's workspace voice helpers: four daily huddles, order read-back, hands-free screen commands
// and team attribution. The huddle (counts only) is spoken in Kayla's own voice, built by the
// voice service itself; order read-backs use Kayla's voice for made-up test patients only (built by the
// service from checked order fields), and the device voice for real patients.

export { TEAM_VOICE, plural, huddleScript, huddleCounts, huddleUpdates, updatesSentence, sessionScript, latestSession, HUDDLE_SESSIONS, type HuddleCounts, type HuddleSession, type HuddleUpdates } from '../../../supabase/functions/_shared/clinical-huddle';

export { prescriptionReadBack, labReadBack, type RxReadBack } from '../../../supabase/functions/_shared/clinical-readback';

/** Hands-free screen commands, e.g. "Kayla, open schedule". Returns a workspace screen key, or null. */
const COMMANDS: [RegExp, string][] = [
  [/\b(schedule|appointments?|calendar)\b/, 'pilot-patients'],
  [/\b(labs?|lab results?|blood work)\b/, 'pilot-patients'],
  [/\b(vitals?|blood pressure|chart|patients?)\b/, 'pilot-patients'],
  [/\b(notes?|dictat\w*|scribe)\b/, 'notes'],
  [/\bdelegation\b/, 'delegation'],
  [/\b(billing|claims?)\b/, 'billing'],
  [/\bdashboard|home\b/, 'dashboard'],
  [/\b(doctor day|my day|huddle)\b/, 'doctor-day'],
  [/\bmedications?\b/, 'medication-review'],
];
export function voiceCommand(spoken: string): string | null {
  const t = spoken.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const m = t.match(/^(?:hey |ok |okay )?kayla (?:please )?(?:open|show(?: me)?|go to|take me to|pull up)(?: the| my)? (.+)$/);
  if (!m) return null;
  for (const [re, key] of COMMANDS) if (re.test(m[1])) return key;
  return null;
}

export const VOICE_RATES = [1, 1.25, 1.5] as const;

/** Speak with the device voice; returns a stop function. Nothing leaves the browser. */
export function speakOnDevice(text: string, opts: { rate?: number; onEnd?: () => void } = {}): () => void {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') { opts.onEnd?.(); return () => {}; }
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = opts.rate ?? 1;
  const voices = synth.getVoices?.() ?? [];
  const en = voices.filter(v => v.lang?.toLowerCase().startsWith('en-us'));
  const pick = ['Samantha', 'Ava', 'Allison', 'Aria', 'Jenny', 'Google US English'].map(n => en.find(v => v.name.includes(n))).find(Boolean) ?? en[0];
  if (pick) u.voice = pick;
  u.onend = () => opts.onEnd?.(); u.onerror = () => opts.onEnd?.();
  synth.speak(u);
  return () => synth.cancel();
}
