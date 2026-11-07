// Pilot test-patient rules for 1325 Clinical. Mirrors the database triggers on
// hc_pilot_patients / hc_pilot_records so the screen explains problems before saving.
// Real patient data stays locked: this pilot accepts made-up test patients only
// until vendor BAAs are signed and a healthcare attorney approves go-live.

export const PILOT_DATA_MODE = 'test_patients_only' as const;

export const RECORD_TYPES = ['visit_note', 'vitals', 'medication', 'allergy', 'problem', 'lab_result'] as const;
export type PilotRecordType = (typeof RECORD_TYPES)[number];

export const RECORD_TYPE_LABELS: Record<PilotRecordType, string> = {
  visit_note: 'Visit note',
  vitals: 'Vital signs',
  medication: 'Medicine',
  allergy: 'Allergy',
  problem: 'Problem / diagnosis',
  lab_result: 'Lab result',
};

export const SEX_OPTIONS = ['female', 'male', 'other', 'unknown'] as const;

const SSN = /[0-9]{3}-[0-9]{2}-[0-9]{4}/;
export const containsSsn = (...parts: (string | null | undefined)[]) => SSN.test(parts.filter(Boolean).join(' '));

export const splitList = (value: string) =>
  value.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 30);

export interface PilotPatientInput {
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  sex?: string | null;
  phone?: string | null;
  allergies?: string[];
  conditions?: string[];
  test_patient_confirmed: boolean;
}

export function validatePilotPatient(p: PilotPatientInput, today = new Date()): string | null {
  if (!p.test_patient_confirmed) return 'Confirm this is a made-up test patient, not a real person.';
  const first = p.first_name.trim();
  const last = p.last_name.trim();
  if (!first || !last) return 'First and last name are required.';
  if (first.length > 80 || last.length > 80) return 'Names must be 80 characters or fewer.';
  if (p.date_of_birth) {
    const dob = new Date(`${p.date_of_birth}T00:00:00`);
    if (Number.isNaN(dob.getTime()) || dob > today || dob < new Date('1900-01-01T00:00:00')) return 'Date of birth must be between 1900 and today.';
  }
  if (p.sex && !(SEX_OPTIONS as readonly string[]).includes(p.sex)) return 'Choose a valid sex option.';
  if (p.phone && p.phone.length > 30) return 'Phone number is too long.';
  if (containsSsn(first, last, p.phone, ...(p.allergies ?? []), ...(p.conditions ?? []))) return 'Social Security numbers are not allowed.';
  return null;
}

export interface PilotRecordInput {
  record_type: string;
  recorded_on: string;
  title: string;
  details?: string | null;
  bp_sys?: number | null;
  bp_dia?: number | null;
  heart_rate?: number | null;
  weight_lb?: number | null;
  temperature_f?: number | null;
  medication_name?: string | null;
  dose?: string | null;
}

const outOfRange = (v: number | null | undefined, min: number, max: number) => v != null && (Number.isNaN(v) || v < min || v > max);

export function validatePilotRecord(r: PilotRecordInput, today = new Date()): string | null {
  if (!(RECORD_TYPES as readonly string[]).includes(r.record_type)) return 'Choose a record type.';
  const title = r.title.trim();
  if (title.length < 2 || title.length > 140) return 'Title is required (140 characters max).';
  if (r.details && r.details.length > 5000) return 'Details must be 5,000 characters or fewer.';
  const date = new Date(`${r.recorded_on}T00:00:00`);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  if (Number.isNaN(date.getTime()) || date > tomorrow || date < new Date('1900-01-01T00:00:00')) return 'Record date must not be in the future.';
  if (containsSsn(title, r.details, r.medication_name, r.dose)) return 'Social Security numbers are not allowed.';
  if (outOfRange(r.bp_sys, 50, 300)) return 'Systolic blood pressure must be 50–300.';
  if (outOfRange(r.bp_dia, 20, 200)) return 'Diastolic blood pressure must be 20–200.';
  if (outOfRange(r.heart_rate, 20, 250)) return 'Heart rate must be 20–250.';
  if (outOfRange(r.weight_lb, 1, 1000)) return 'Weight must be 1–1000 lb.';
  if (outOfRange(r.temperature_f, 85, 115)) return 'Temperature must be 85–115 °F.';
  if (r.record_type === 'medication' && (r.medication_name ?? '').trim().length < 2) return 'Medicine name is required.';
  return null;
}

export function validateErrorReason(reason: string): string | null {
  return reason.trim().length >= 3 ? null : 'Give a short reason (at least 3 characters).';
}

export const AUDIT_LABELS: Record<string, string> = {
  patient_created: 'Added test patient',
  patient_updated: 'Changed patient details',
  patient_archived: 'Archived test patient',
  record_added: 'Added a record',
  record_marked_error: 'Marked a record as entered in error',
  chart_opened: 'Opened chart',
};
