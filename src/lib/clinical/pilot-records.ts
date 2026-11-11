// Pilot test-patient rules for 1325 Clinical. Mirrors the database triggers on
// hc_pilot_patients / hc_pilot_records so the screen explains problems before saving.
// Real patient data stays locked: this pilot accepts made-up test patients only
// until vendor BAAs are signed and a healthcare attorney approves go-live.

import { validateChartExtras } from './real-patient-chart';

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
  med_frequency?: string | null;
  med_route?: string | null;
  allergy_reaction?: string | null;
  allergy_severity?: string | null;
  lab_value?: string | null;
  lab_unit?: string | null;
  lab_ref_range?: string | null;
  lab_flag?: string | null;
}

const outOfRange = (v: number | null | undefined, min: number, max: number) => v != null && (Number.isNaN(v) || v < min || v > max);

export function validatePilotRecord(r: PilotRecordInput, today = new Date(), opts: { real?: boolean } = {}): string | null {
  if (!(RECORD_TYPES as readonly string[]).includes(r.record_type)) return 'Choose a record type.';
  const title = r.title.trim();
  if (title.length < 2 || title.length > 140) return 'Title is required (140 characters max).';
  if (r.details && r.details.length > 5000) return 'Details must be 5,000 characters or fewer.';
  const date = new Date(`${r.recorded_on}T00:00:00`);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  if (Number.isNaN(date.getTime()) || date > tomorrow || date < new Date('1900-01-01T00:00:00')) return 'Record date must not be in the future.';
  if (containsSsn(title, r.details, r.medication_name, r.dose, r.med_frequency, r.med_route, r.allergy_reaction, r.lab_value, r.lab_unit, r.lab_ref_range)) return 'Social Security numbers are not allowed.';
  const extras = validateChartExtras(r, { real: opts.real === true });
  if (extras) return extras;
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

/** Every new pilot clinic opens with this many made-up sample patients (loaded by the database). */
export const SAMPLE_PATIENT_COUNT = 3;
export const SAMPLE_BADGE_LABEL = 'Sample test patient';

/** Load samples once, only after a successful load shows the clinic has never had any patient (archived ones count). */
export function shouldLoadSamples(s: { loading: boolean; error: unknown; totalPatients: number; alreadyTried: boolean }) {
  return !s.loading && !s.error && s.totalPatients === 0 && !s.alreadyTried;
}

export const AUDIT_LABELS: Record<string, string> = {
  pilot_reset: 'Reset the pilot and reloaded the sample patients',
  patient_created: 'Added patient',
  go_live_unlocked: 'Unlocked real patients (go-live approval recorded)',
  go_live_locked: 'Locked real patients again',
  patient_updated: 'Changed patient details',
  patient_archived: 'Archived test patient',
  record_added: 'Added a record',
  record_marked_error: 'Marked a record as entered in error',
  medicine_stopped: 'Stopped a medicine',
  chart_opened: 'Opened chart',
  note_drafted: 'Started a visit note',
  note_draft_updated: 'Changed a draft visit note',
  note_signed: 'Signed and locked a visit note',
  note_addendum_added: 'Added an addendum to a visit note',
  note_marked_error: 'Marked a visit note as entered in error',
  emergency_access: 'Used emergency “break the glass” access',
  prescription_written: 'Wrote a practice prescription',
  prescription_renewed: 'Renewed a practice prescription',
  prescription_stopped: 'Stopped a prescription',
  prescription_marked_error: 'Marked a prescription as entered in error',
  lab_ordered: 'Ordered a lab test',
  lab_collected: 'Marked a lab sample collected',
  lab_resulted: 'Entered a lab result for an order',
  lab_cancelled: 'Cancelled a lab order',
  social_needs_screened: 'Recorded a social-needs screening',
  social_screening_marked_error: 'Marked a social-needs screening as entered in error',
  appointment_booked: 'Booked an appointment',
  appointment_rescheduled: 'Rescheduled an appointment',
  appointment_checked_in: 'Checked in a patient',
  appointment_completed: 'Marked an appointment done',
  appointment_discharged: 'Discharged a patient',
  appointment_left_ama: 'Recorded a patient leaving against medical advice',
  appointment_cancelled: 'Cancelled an appointment',
  appointment_no_show: 'Marked an appointment no-show',
  claim_started: 'Started a practice claim',
  claim_edited: 'Edited a practice claim',
  claim_draft: 'Moved a practice claim back to draft',
  claim_ready: 'Marked a practice claim ready',
  claim_practice_submitted: 'Marked a practice claim sent (not really sent)',
  claim_practice_paid: 'Recorded a practice payment',
  claim_practice_denied: 'Recorded a practice denial',
  claim_void: 'Voided a practice claim',
  portal_invited: 'Gave a tester portal access',
  portal_revoked: 'Removed a tester’s portal access',
  portal_message_patient: 'Patient sent a portal message',
  portal_message_clinic: 'Clinic replied in the portal',
};
