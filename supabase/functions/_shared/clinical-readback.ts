// Kayla's verbal read-back of a practice prescription or lab order before the doctor saves it.
// Shared by the workspace screen and the Kayla voice service, so the words are identical. The voice
// service builds the sentence itself from checked order fields and the test patient's own allergies,
// and only for made-up test patients while the clinic is not cleared for real patients.
import { TEAM_VOICE, plural } from './clinical-huddle.ts';

export type RxReadBack = { drug_name: string; strength?: string | null; dose: string; route: string; frequency: string; quantity?: string; refills?: string; days_supply?: string };

/** Verbal read-back of a practice prescription before the doctor saves it. */
export function prescriptionReadBack(rx: RxReadBack, warnings: unknown[], allergies: string[]): string {
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

/** Same lists as src/lib/clinical/prescriptions.ts and lab-orders.ts (a test keeps them equal). */
export const READBACK_ROUTES = ['by mouth', 'under the tongue', 'on the skin', 'inhaled', 'injection', 'eye drops', 'ear drops', 'nasal', 'rectal', 'other'] as const;
export const READBACK_PRIORITY_LABELS: Record<string, string> = { routine: 'Routine', urgent: 'Urgent', stat: 'STAT (right away)' };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Plain order words only: letters (any language), numbers, spaces and ordinary punctuation.
const PLAIN = /^[\p{L}\p{N} .,'’()\/%+&:;-]*$/u;
const text = (v: unknown, max: number, required = false): string | null => {
  if (typeof v !== 'string') return null;
  const t = v.replace(/\s+/g, ' ').trim();
  if (t.length > max || (required && !t) || !PLAIN.test(t)) return null;
  return t;
};
const count = (v: unknown, max: number): string | null => {
  if (v === '' || v === undefined || v === null) return '';
  const s = String(v).trim();
  return /^\d{1,4}$/.test(s) && Number(s) <= max ? s : null;
};

export type ReadBackRequest =
  | { kind: 'rx'; clinicId: string; patientId: string; part: number; rx: RxReadBack; warnings: number }
  | { kind: 'lab'; clinicId: string; patientId: string; part: number; test: string; priority: string; reason: string };

/** Exactly the order fields (checked for length and plain words); nothing else is accepted. */
export function parseReadBackRequest(body: unknown, maxParts = 16): ReadBackRequest | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  const keys = Object.keys(b).filter((k) => k !== 'part').sort().join(',');
  if (keys !== 'clinic_id,order,patient_id,readback') return null;
  if (typeof b.clinic_id !== 'string' || !UUID.test(b.clinic_id) || typeof b.patient_id !== 'string' || !UUID.test(b.patient_id)) return null;
  const part = b.part === undefined ? 0 : b.part;
  if (typeof part !== 'number' || !Number.isInteger(part) || part < 0 || part >= maxParts) return null;
  const o = b.order;
  if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
  const f = o as Record<string, unknown>;
  const base = { clinicId: b.clinic_id, patientId: b.patient_id, part };
  if (b.readback === 'rx') {
    if (Object.keys(f).sort().join(',') !== 'days_supply,dose,drug_name,frequency,quantity,refills,route,strength,warnings') return null;
    const drug = text(f.drug_name, 120, true), strength = f.strength === null ? '' : text(f.strength, 60), dose = text(f.dose, 60), frequency = text(f.frequency, 60);
    const quantity = count(f.quantity, 1000), refills = count(f.refills, 11), days = count(f.days_supply, 365);
    const route = typeof f.route === 'string' && (READBACK_ROUTES as readonly string[]).includes(f.route) ? f.route : null;
    const warnings = typeof f.warnings === 'number' && Number.isInteger(f.warnings) && f.warnings >= 0 && f.warnings <= 20 ? f.warnings : null;
    if (drug === null || strength === null || dose === null || frequency === null || quantity === null || refills === null || days === null || route === null || warnings === null) return null;
    return { kind: 'rx', ...base, warnings, rx: { drug_name: drug, strength, dose, route, frequency, quantity, refills, days_supply: days } };
  }
  if (b.readback === 'lab') {
    if (Object.keys(f).sort().join(',') !== 'priority,reason,test_name') return null;
    const test = text(f.test_name, 140, true), reason = text(f.reason, 300);
    const priority = typeof f.priority === 'string' && f.priority in READBACK_PRIORITY_LABELS ? f.priority : null;
    if (test === null || reason === null || priority === null) return null;
    return { kind: 'lab', ...base, test, priority, reason };
  }
  return null;
}

/** The spoken words for a checked request plus the allergies the service read from the test chart. */
export function readBackWords(r: ReadBackRequest, allergies: string[]): string {
  return r.kind === 'rx'
    ? prescriptionReadBack(r.rx, Array.from({ length: r.warnings }), allergies)
    : labReadBack(r.test, READBACK_PRIORITY_LABELS[r.priority], r.reason);
}
