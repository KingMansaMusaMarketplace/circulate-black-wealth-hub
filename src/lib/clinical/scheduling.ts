// Pilot appointment rules. Mirrors the hc_pilot_appointments_validate trigger;
// the database is the real lock (no double-booking, allowed status steps).

export const VISIT_TYPES = ['new_patient', 'follow_up', 'annual', 'urgent', 'telehealth', 'procedure'] as const;
export type VisitType = (typeof VISIT_TYPES)[number];
export const VISIT_TYPE_LABELS: Record<VisitType, string> = {
  new_patient: 'New patient', follow_up: 'Follow-up', annual: 'Annual physical', urgent: 'Same-day / urgent', telehealth: 'Telehealth', procedure: 'Procedure',
};

export const APPT_STATUSES = ['scheduled', 'checked_in', 'completed', 'discharged', 'left_ama', 'cancelled', 'no_show'] as const;
export type ApptStatus = (typeof APPT_STATUSES)[number];
export const APPT_STATUS_LABELS: Record<ApptStatus, string> = {
  scheduled: 'Booked', checked_in: 'Checked in', completed: 'Done', discharged: 'Discharged', left_ama: 'Left against medical advice (AMA)', cancelled: 'Cancelled', no_show: 'No-show',
};
export const APPT_STEP_LABELS: Partial<Record<ApptStatus, string>> = {
  checked_in: 'Check in', completed: 'Mark done', discharged: 'Discharge', left_ama: 'Left AMA', cancelled: 'Cancel', no_show: 'No-show',
};

export const APPT_LENGTHS = [10, 15, 20, 30, 40, 60, 90] as const;
export const isOpenAppt = (s: string) => s === 'scheduled' || s === 'checked_in';

/** Allowed next steps from a status (same as the database). Discharge and AMA are for clinical staff only. */
export function nextApptSteps(status: string, clinicalStaff = false): ApptStatus[] {
  if (status === 'scheduled') return ['checked_in', 'no_show', 'cancelled'];
  if (status === 'checked_in') return clinicalStaff ? ['completed', 'discharged', 'left_ama', 'cancelled'] : ['completed', 'cancelled'];
  return [];
}

/** Local date ("2026-11-09") + time ("09:30") → Date. */
export function combineLocal(date: string, time: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const d = new Date(`${date}T${time}:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

type Slot = { id?: string; provider_id: string; starts_at: string; duration_min: number; status: string };

export function overlaps(a: Slot, b: Slot): boolean {
  const as = new Date(a.starts_at).getTime(); const ae = as + a.duration_min * 60_000;
  const bs = new Date(b.starts_at).getTime(); const be = bs + b.duration_min * 60_000;
  return as < be && bs < ae;
}

/** First open appointment for the same provider that overlaps the candidate. */
export function findConflict(existing: Slot[], candidate: Slot): Slot | null {
  return existing.find((e) => e.id !== candidate.id && e.provider_id === candidate.provider_id && isOpenAppt(e.status) && overlaps(e, candidate)) ?? null;
}

export interface AppointmentInput {
  patient_id: string; provider_id: string; date: string; time: string; duration_min: number; visit_type: string; reason: string;
}

export function validateAppointment(a: AppointmentInput, now = new Date()): string | null {
  if (!a.patient_id) return 'Choose a test patient.';
  if (!a.provider_id) return 'Choose a doctor or nurse.';
  const start = combineLocal(a.date, a.time);
  if (!start) return 'Choose a date and time.';
  if (start.getTime() < now.getTime() - 24 * 3_600_000) return 'Appointments can’t be booked more than a day in the past.';
  if (start.getTime() > now.getTime() + 400 * 24 * 3_600_000) return 'Choose a date within the next 13 months.';
  if (!Number.isInteger(a.duration_min) || a.duration_min < 5 || a.duration_min > 240) return 'Length must be 5 to 240 minutes.';
  if (!(VISIT_TYPES as readonly string[]).includes(a.visit_type)) return 'Choose a visit type.';
  if (a.reason.trim().length > 300) return 'Reason is too long (300 characters max).';
  if (/\d{3}-\d{2}-\d{4}/.test(a.reason)) return 'Social Security numbers are not allowed.';
  return null;
}

/** An against-medical-advice departure needs a short written reason, as in a real chart. */
export function validateAmaReason(reason: string): string | null {
  const r = reason.trim();
  if (r.length < 3) return 'Describe why the patient left against medical advice (at least 3 characters).';
  if (r.length > 300) return 'Reason is too long (300 characters max).';
  if (/\d{3}-\d{2}-\d{4}/.test(r)) return 'Social Security numbers are not allowed.';
  return null;
}

export function validateCancelReason(reason: string): string | null {
  const r = reason.trim();
  if (r.length < 3) return 'Give a reason for cancelling (at least 3 characters).';
  if (r.length > 300) return 'Reason is too long (300 characters max).';
  if (/\d{3}-\d{2}-\d{4}/.test(r)) return 'Social Security numbers are not allowed.';
  return null;
}
