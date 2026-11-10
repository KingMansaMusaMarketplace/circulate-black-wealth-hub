// Kayla's workspace voice helpers: morning huddle, order read-back, hands-free screen commands
// and team attribution. The huddle (counts only) is spoken in Kayla's own voice, built by the
// voice service itself; order read-backs stay on the device voice so chart words never leave the browser.

import { TEAM_VOICE, plural } from '../../../supabase/functions/_shared/clinical-huddle';
export { TEAM_VOICE, plural, huddleScript, huddleCounts, type HuddleCounts } from '../../../supabase/functions/_shared/clinical-huddle';

export type RxReadBack = { drug_name: string; strength?: string | null; dose: string; route: string; frequency: string; quantity?: string; refills?: string; days_supply?: string };

/** Verbal read-back of a practice prescription before the doctor saves it. */
export function prescriptionReadBack(rx: RxReadBack, warnings: string[], allergies: string[]): string {
  const drug = [rx.drug_name.trim(), rx.strength?.trim()].filter(Boolean).join(' ');
  const parts = [`Read-back from ${TEAM_VOICE.pharmacy}. Confirming: ${drug || 'no medicine entered'}.`];
  if (rx.dose.trim()) parts.push(`Dose: ${rx.dose.trim()}, ${rx.route}.`);
  if (rx.frequency.trim()) parts.push(`How often: ${rx.frequency.trim()}.`);
  if (rx.quantity?.trim()) parts.push(`Quantity ${rx.quantity.trim()}, ${plural(Number(rx.refills || 0), 'refill')}${rx.days_supply?.trim() ? `, ${rx.days_supply.trim()} days supply` : ''}.`);
  parts.push(allergies.length ? `Recorded allergies: ${allergies.join(', ')}.` : 'No allergies are recorded on this chart.');
  parts.push(warnings.length ? `Caution: the safety check found ${plural(warnings.length, 'warning')}. Please review before saving.` : 'The starter safety check found no warnings.');
  parts.push('Please confirm on screen before saving. This practice prescription is never sent to a pharmacy.');
  return parts.join(' ');
}

export function labReadBack(test: string, priorityLabel: string, reason: string): string {
  return [`Read-back from ${TEAM_VOICE.labs}. Confirming: ${test.trim() || 'no test entered'}, priority ${priorityLabel}.`,
    reason.trim() ? `Reason: ${reason.trim()}.` : '', 'Please confirm on screen before saving. This practice order is never sent to a lab.'].filter(Boolean).join(' ');
}

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
