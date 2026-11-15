// "Due for care" reminders for pilot charts. Display-only suggestions computed in the browser
// from the chart itself; nothing is ordered, saved or sent. Ages and time gaps follow:
//  - USPSTF colorectal cancer screening (2021): adults 45–75. Intervals: colonoscopy 10 yr,
//    FIT/stool blood test 1 yr, stool DNA-FIT 1–3 yr (3 used), CT colonography / flexible sigmoidoscopy 5 yr.
//  - USPSTF breast cancer screening (2024): women 40–74, mammogram every 2 years.
//  - USPSTF cervical cancer screening (2018): women 21–65; Pap (cytology) every 3 years,
//    or from age 30 HPV testing every 5 years.
//  - USPSTF osteoporosis screening (2025): women 65 and older (no fixed repeat interval → "on record").
//  - USPSTF hepatitis C screening (2020): adults 18–79, at least once.
//  - USPSTF HIV screening (2019): ages 15–65, at least once.
//  - ADA Standards of Care in Diabetes: A1c at least twice a year (6 months);
//    kidney check (urine albumin-to-creatinine ratio and eGFR) at least once a year.
// A reminder only means "no matching record in this chart"; the test may have been done elsewhere.

export const CARE_REMINDER_NOTICE =
  'Suggestions only, from U.S. screening guidelines (USPSTF) and diabetes care standards (ADA). Nothing is ordered automatically — the doctor decides. “Due” means this chart has no matching record; the test may have been done elsewhere.';
export const QUALITY_NOTICE = 'Practice numbers for this clinic’s test patients only — never sent to Medicare or any quality program.';

type Evidence = { pattern: RegExp; months: number | null; minAge?: number };
type Ctx = { age: number; sex: string | null; diabetes: boolean };
export interface CareRule {
  id: string; title: string; why: string; source: string;
  applies: (c: Ctx) => boolean;
  evidence: Evidence[];
}

const isFemale = (c: Ctx) => c.sex === 'female';
export const CARE_RULES: CareRule[] = [
  { id: 'colorectal', title: 'Colon cancer screening', why: 'Adults 45 to 75', source: 'USPSTF 2021',
    applies: (c) => c.age >= 45 && c.age <= 75,
    evidence: [
      { pattern: /colonoscopy/i, months: 120 },
      { pattern: /cologuard|stool dna|fit-dna|mt-sdna/i, months: 36 },
      { pattern: /\bfit\b|fecal immunochemical|\bfobt\b|stool (blood|test)|occult blood/i, months: 12 },
      { pattern: /ct colonography|sigmoidoscopy/i, months: 60 },
    ] },
  { id: 'breast', title: 'Mammogram', why: 'Women 40 to 74, every 2 years', source: 'USPSTF 2024',
    applies: (c) => isFemale(c) && c.age >= 40 && c.age <= 74,
    evidence: [{ pattern: /mammogra/i, months: 24 }] },
  { id: 'cervical', title: 'Cervical cancer screening', why: 'Women 21 to 65 (Pap every 3 years, or HPV test every 5 years from 30)', source: 'USPSTF 2018',
    applies: (c) => isFemale(c) && c.age >= 21 && c.age <= 65,
    evidence: [{ pattern: /\bpap\b|cervical cytology/i, months: 36 }, { pattern: /\bhpv\b/i, months: 60, minAge: 30 }] },
  { id: 'osteoporosis', title: 'Bone density scan', why: 'Women 65 and older', source: 'USPSTF 2025',
    applies: (c) => isFemale(c) && c.age >= 65,
    evidence: [{ pattern: /\bdexa\b|\bdxa\b|bone density/i, months: null }] },
  { id: 'hepatitis_c', title: 'Hepatitis C test (once)', why: 'Adults 18 to 79, at least once', source: 'USPSTF 2020',
    applies: (c) => c.age >= 18 && c.age <= 79,
    evidence: [{ pattern: /hepatitis c|\bhep c\b|\bhcv\b/i, months: null }] },
  { id: 'hiv', title: 'HIV test (once)', why: 'Ages 15 to 65, at least once', source: 'USPSTF 2019',
    applies: (c) => c.age >= 15 && c.age <= 65,
    evidence: [{ pattern: /\bhiv\b/i, months: null }] },
  { id: 'diabetes_a1c', title: 'A1c (3-month blood sugar test)', why: 'Diabetes: at least every 6 months', source: 'ADA Standards of Care',
    applies: (c) => c.diabetes,
    evidence: [{ pattern: /a1c/i, months: 6 }] },
  { id: 'diabetes_kidney', title: 'Diabetes kidney check', why: 'Diabetes: urine albumin and eGFR at least yearly (type 1: from 5 years after diagnosis)', source: 'ADA Standards of Care',
    applies: (c) => c.diabetes,
    evidence: [{ pattern: /egfr|creatinine|albumin|\buacr\b|kidney function/i, months: 12 }] },
];

type PatientLike = { date_of_birth?: string | null; sex?: string | null; conditions?: string[] | null };
type RecordLike = { record_type: string; status?: string | null; title?: string | null; details?: string | null; recorded_on: string };

/** Whole years between a YYYY-MM-DD birth date and `now`, or null when missing/invalid. */
export function ageOn(dob: string | null | undefined, now = new Date()): number | null {
  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const [y, m, d] = dob.split('-').map(Number);
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age -= 1;
  return age >= 0 && age < 130 ? age : null;
}

const DIABETES = /diabet|\bt[12]dm\b/i;
const NOT_DIABETES = /pre-?diabet/i;
export function hasDiabetes(p: PatientLike, records: RecordLike[]): boolean {
  const texts = [...(p.conditions ?? []), ...records.filter((r) => r.record_type === 'problem' && r.status !== 'entered_in_error').map((r) => r.title ?? '')];
  return texts.some((t) => DIABETES.test(t) && !NOT_DIABETES.test(t));
}

/** Add whole months to a YYYY-MM-DD date (day clamped to month end). */
export function addMonthsIso(iso: string, months: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const total = (y * 12 + (m - 1)) + months;
  const ny = Math.floor(total / 12); const nm = total % 12;
  const last = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
  return `${ny}-${String(nm + 1).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}

export type Reminder = { id: string; title: string; why: string; source: string; status: 'due' | 'up_to_date'; lastDone: string | null; dueAgain: string | null };

const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Reminders that apply to this patient, "due" first. Empty when the birth date is missing. */
export function careReminders(p: PatientLike, records: RecordLike[], now = new Date()): Reminder[] {
  const age = ageOn(p.date_of_birth, now);
  if (age === null) return [];
  const ctx: Ctx = { age, sex: p.sex ?? null, diabetes: hasDiabetes(p, records) };
  const today = isoDay(now);
  const usable = records.filter((r) => r.status !== 'entered_in_error' && r.recorded_on <= today);
  const out: Reminder[] = [];
  for (const rule of CARE_RULES) {
    if (!rule.applies(ctx)) continue;
    let best: { last: string; until: string | null } | null = null;
    for (const ev of rule.evidence) {
      if (ev.minAge && age < ev.minAge) continue;
      for (const r of usable) {
        if (!ev.pattern.test(`${r.title ?? ''} ${r.details ?? ''}`)) continue;
        const until = ev.months === null ? null : addMonthsIso(r.recorded_on, ev.months);
        if (until !== null && until <= today) continue;
        // Keep the coverage that lasts longest ("once" beats any interval).
        if (!best || (best.until !== null && (until === null || until > best.until))) best = { last: r.recorded_on, until };
      }
    }
    out.push({ id: rule.id, title: rule.title, why: rule.why, source: rule.source, status: best ? 'up_to_date' : 'due', lastDone: best?.last ?? null, dueAgain: best?.until ?? null });
  }
  return out.sort((a, b) => (a.status === b.status ? 0 : a.status === 'due' ? -1 : 1));
}

export type QualityRow = { id: string; title: string; source: string; eligible: number; upToDate: number };
/** Clinic-wide counts per reminder (patients it applies to, and how many are up to date). */
export function qualitySnapshot(patients: (PatientLike & { id: string; archived_at?: string | null })[], records: (RecordLike & { patient_id: string })[], now = new Date()): QualityRow[] {
  const byPatient = new Map<string, RecordLike[]>();
  for (const r of records) byPatient.set(r.patient_id, [...(byPatient.get(r.patient_id) ?? []), r]);
  const rows = new Map<string, QualityRow>(CARE_RULES.map((r) => [r.id, { id: r.id, title: r.title, source: r.source, eligible: 0, upToDate: 0 }]));
  for (const p of patients) {
    if (p.archived_at) continue;
    for (const rem of careReminders(p, byPatient.get(p.id) ?? [], now)) {
      const row = rows.get(rem.id)!; row.eligible += 1; if (rem.status === 'up_to_date') row.upToDate += 1;
    }
  }
  return [...rows.values()].filter((r) => r.eligible > 0);
}
