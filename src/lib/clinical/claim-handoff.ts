// Billing-partner hand-off preview. Shows how a saved 1325 practice claim would fill the
// standard paper claim form (CMS-1500, 02/12) box by box for a billing partner such as Helios RCM.
// Preview and local sample download only: never transmitted, never a real claim, no suggested codes.
import { claimTotalCents, formatCents, normalizeDx, type ClaimLine } from './practice-billing';
import { formatAddress, type PatientDetails } from './patient-details';

export const HANDOFF_PARTNER = 'Helios RCM';
export const HANDOFF_PARTNER_STATUS = 'partnership under discussion';
export const SAMPLE_STAMP = 'SAMPLE — NOT FOR SUBMISSION';
export const HANDOFF_NOTICE =
  `Preview only. This shows how a 1325 practice claim would fill the standard claim form (CMS-1500) for a billing partner such as ${HANDOFF_PARTNER} (${HANDOFF_PARTNER_STATUS} — not a current partner). Nothing is sent anywhere, and the download is stamped “${SAMPLE_STAMP}”.`;
export const PARTNER_SUPPLIES = 'Clinic or billing partner supplies — not stored in the pilot';

export const PLACES_OF_SERVICE = [
  { code: '11', label: 'Office' },
  { code: '02', label: 'Telehealth, not in the patient’s home' },
  { code: '10', label: 'Telehealth in the patient’s home' },
] as const;
export type PlaceOfService = (typeof PLACES_OF_SERVICE)[number]['code'];

export type HandoffBox = { box: string; label: string; value: string; missing?: boolean };
export type HandoffLine = { n: number; date: string; pos: string; code: string; modifier: string; pointers: string; charge: string; units: string; npi: string };
export type HandoffPreview = { boxes: HandoffBox[]; lines: HandoffLine[]; totalCents: number; missing: number };

type ClaimLike = { id: string; service_date: string; payer_name: string; member_id?: string | null; diagnosis_codes?: string[] | null; lines?: ClaimLine[] | null; status: string; paid_cents?: number | null };
type PatientLike = PatientDetails & { id: string; date_of_birth?: string | null; sex?: string | null };
export type HandoffInput = { claim: ClaimLike; patient: PatientLike | null; patientName: string; clinicName?: string | null; signerEmail?: string | null; signedAt?: string | null; pos: PlaceOfService };

/** 1 → "A" … 12 → "L" (CMS-1500 box 21 letters). */
export const pointerLetter = (n: number) => (Number.isInteger(n) && n >= 1 && n <= 12 ? String.fromCharCode(64 + n) : '?');

/** "2026-11-09" → "11 09 26" (box 24A short date) or "11 09 2026" (long). */
export function claimDate(iso: string | null | undefined, long = false): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${m} ${d} ${long ? y : y.slice(2)}`;
}

/** Box 1 insurance type from the payer name. */
export function insuranceType(payer: string): string {
  const p = payer.trim();
  if (/^self[\s-]?pay$/i.test(p)) return 'Self-pay — no insurance claim needed';
  if (/medicare/i.test(p)) return 'Medicare';
  if (/medicaid/i.test(p)) return 'Medicaid';
  if (/tricare/i.test(p)) return 'TRICARE';
  if (/champva/i.test(p)) return 'CHAMPVA';
  return 'Group health plan';
}

const sexLetter = (s?: string | null) => (s === 'male' ? 'M' : s === 'female' ? 'F' : '');

export function buildHandoffPreview(i: HandoffInput): HandoffPreview {
  const p = i.patient;
  const dx = normalizeDx(i.claim.diagnosis_codes ?? []);
  const claimLines = (i.claim.lines ?? []) as ClaimLine[];
  const totalCents = claimTotalCents(claimLines);
  const need = (box: string, label: string, value: string | null | undefined): HandoffBox =>
    value && value.trim() ? { box, label, value: value.trim() } : { box, label, value: PARTNER_SUPPLIES, missing: true };
  const birth = [claimDate(p?.date_of_birth, true), sexLetter(p?.sex)].filter(Boolean).join(' · ');
  const boxes: HandoffBox[] = [
    { box: '1', label: 'Insurance type', value: insuranceType(i.claim.payer_name) },
    need('1a', 'Insured’s ID number', i.claim.member_id),
    { box: '2', label: 'Patient’s name', value: i.patientName },
    need('3', 'Patient’s birth date · sex', birth),
    { box: '4', label: 'Insured’s name', value: 'Same as patient (pilot assumes the patient is the policyholder)' },
    need('5', 'Patient’s address', p ? formatAddress(p) : null),
    { box: '6', label: 'Patient relationship to insured', value: 'Self' },
    need('11c', 'Insurance plan name', p?.insurance_plan || (/^self[\s-]?pay$/i.test(i.claim.payer_name.trim()) ? null : i.claim.payer_name)),
    { box: '12–13', label: 'Patient / insured signatures', value: 'Signature on file — the clinic collects this', missing: true },
    { box: '21', label: 'Diagnosis codes (ICD-10, indicator 0)', value: dx.length ? dx.map((c, n) => `${pointerLetter(n + 1)}. ${c}`).join('   ') : 'None entered yet' , missing: dx.length === 0 },
    { box: '24', label: 'Service lines', value: `${claimLines.length} line${claimLines.length === 1 ? '' : 's'} (see table)`, missing: claimLines.length === 0 },
    need('25', 'Federal tax ID', null),
    { box: '26', label: 'Patient account number', value: (p?.id ?? '').replace(/-/g, '').slice(0, 10).toUpperCase() || '—' },
    { box: '28', label: 'Total charge', value: formatCents(totalCents) },
    { box: '29', label: 'Amount paid', value: formatCents(i.claim.status === 'practice_paid' ? i.claim.paid_cents ?? 0 : 0) },
    need('31', 'Signature of physician', i.signerEmail ? `${i.signerEmail}${i.signedAt ? ` · signed ${claimDate(i.signedAt, true)}` : ''}` : null),
    need('32', 'Service facility', i.clinicName),
    need('33', 'Billing provider', i.clinicName),
    need('33a', 'Billing provider NPI', null),
  ];
  const lines: HandoffLine[] = claimLines.map((l, n) => ({
    n: n + 1, date: claimDate(i.claim.service_date), pos: i.pos, code: l.code, modifier: l.modifier ?? '',
    pointers: l.dx_pointers.map(pointerLetter).join(''), charge: formatCents(l.units * l.charge_cents), units: String(l.units), npi: PARTNER_SUPPLIES,
  }));
  return { boxes, lines, totalCents, missing: boxes.filter((b) => b.missing).length };
}
