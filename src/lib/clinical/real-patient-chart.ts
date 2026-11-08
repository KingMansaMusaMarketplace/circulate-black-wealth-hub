// Real-patient chart rules for the 1325 Clinical pilot. Mirrors the database
// triggers on hc_pilot_records / hc_pilot_visit_notes so the screen explains
// problems before saving. The database is the real lock: real-patient entries
// save only while hc_real_patients_allowed(clinic) is true (see go-live.ts).

/** Real-patient charts hide themselves after this many idle minutes (test patients use IDLE_LOCK_MINUTES). */
export const REAL_PATIENT_IDLE_LOCK_MINUTES = 5;
/** Signing a real-patient note needs a password sign-in within this many seconds (database-enforced). */
export const REAL_SIGN_PASSWORD_WINDOW_SECONDS = 600;

export const ALLERGY_SEVERITIES = ['mild', 'moderate', 'severe', 'unknown'] as const;
export type AllergySeverity = (typeof ALLERGY_SEVERITIES)[number];
export const ALLERGY_SEVERITY_LABELS: Record<AllergySeverity, string> = {
  mild: 'Mild', moderate: 'Moderate', severe: 'Severe', unknown: 'Unknown',
};

export const LAB_FLAGS = ['normal', 'low', 'high', 'critical', 'abnormal'] as const;
export type LabFlag = (typeof LAB_FLAGS)[number];
export const LAB_FLAG_LABELS: Record<LabFlag, string> = {
  normal: 'Normal', low: 'Low', high: 'High', critical: 'Critical', abnormal: 'Abnormal',
};
export const isFlaggedLab = (flag?: string | null) => !!flag && flag !== 'normal';

export const REAL_DICTATION_OFF =
  'Talk-to-type is off for real patients until the OpenAI agreement and its “Eyes Off” setting are confirmed in writing. Please type.';

/** Test patients are always writable; real patients only while the clinic is unlocked. */
export function chartWritable(real: boolean, realPatientsAllowed: boolean | null): boolean {
  return !real || realPatientsAllowed === true;
}

export function idleLockMinutes(real: boolean, testMinutes: number): number {
  return real ? Math.min(REAL_PATIENT_IDLE_LOCK_MINUTES, testMinutes) : testMinutes;
}

export const dictationAllowed = (real: boolean) => !real;

export interface ChartExtras {
  record_type: string;
  med_frequency?: string | null;
  med_route?: string | null;
  allergy_reaction?: string | null;
  allergy_severity?: string | null;
  lab_value?: string | null;
  lab_unit?: string | null;
  lab_ref_range?: string | null;
  lab_flag?: string | null;
}

const tooLong = (v: string | null | undefined, max: number) => !!v && v.trim().length > max;

export function validateChartExtras(r: ChartExtras, opts: { real: boolean }): string | null {
  if (tooLong(r.med_frequency, 140) || tooLong(r.med_route, 60) || tooLong(r.allergy_reaction, 200)
    || tooLong(r.lab_value, 60) || tooLong(r.lab_unit, 30) || tooLong(r.lab_ref_range, 60)) return 'One of the fields is too long.';
  if (r.allergy_severity && !(ALLERGY_SEVERITIES as readonly string[]).includes(r.allergy_severity)) return 'Choose a valid allergy severity.';
  if (r.lab_flag && !(LAB_FLAGS as readonly string[]).includes(r.lab_flag)) return 'Choose a valid lab result flag.';
  if (opts.real) {
    if (r.record_type === 'lab_result' && !(r.lab_value ?? '').trim()) return 'Real-patient lab results need a result value.';
    if (r.record_type === 'allergy' && !r.allergy_severity) return 'Real-patient allergies need a severity (choose Unknown if not known).';
  }
  return null;
}

export function validateStopMedicine(s: { started_on: string; stopped_on: string; reason: string }, today = new Date()): string | null {
  const stop = new Date(`${s.stopped_on}T00:00:00`);
  const start = new Date(`${s.started_on}T00:00:00`);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  if (Number.isNaN(stop.getTime()) || stop > tomorrow || stop < start) return 'Stop date must be on or after the start date and not in the future.';
  if (s.reason.trim().length < 3) return 'Give a reason for stopping (at least 3 characters).';
  return null;
}

type AnyRow = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Most recent active result per lab test name, newest first. */
export function latestLabs(records: AnyRow[]): AnyRow[] {
  const seen = new Set<string>();
  return records
    .filter((r) => r.record_type === 'lab_result' && r.status === 'active')
    .sort((a, b) => String(b.recorded_on).localeCompare(String(a.recorded_on)) || String(b.created_at).localeCompare(String(a.created_at)))
    .filter((r) => {
      const k = String(r.title).trim().toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
}
