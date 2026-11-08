// Fairness tools for the 1325 Clinical pilot:
// 1. A short social-needs screening based on the five core areas of the CMS
//    Accountable Health Communities screening tool (simplified wording for the pilot).
// 2. The race-free 2021 CKD-EPI kidney-function (eGFR) formula. It does not adjust by race.

export const SOCIAL_DOMAINS = ['housing', 'food', 'transportation', 'utilities', 'safety'] as const;
export type SocialDomain = (typeof SOCIAL_DOMAINS)[number];
export const SOCIAL_ANSWERS = ['yes', 'no', 'declined'] as const;
export type SocialAnswer = (typeof SOCIAL_ANSWERS)[number];
export const SOCIAL_ANSWER_LABELS: Record<SocialAnswer, string> = { yes: 'Yes', no: 'No', declined: 'Prefers not to say' };

export const SOCIAL_QUESTIONS: Record<SocialDomain, { label: string; question: string }> = {
  housing: { label: 'Housing', question: 'Are you worried about losing your housing, or do you not have a steady place to live?' },
  food: { label: 'Food', question: 'In the past 12 months, did you worry your food would run out before you had money to buy more?' },
  transportation: { label: 'Transportation', question: 'In the past 12 months, has a lack of transportation kept you from medical visits, work or getting things you need?' },
  utilities: { label: 'Utilities', question: 'In the past 12 months, has the electric, gas, oil or water company threatened to shut off service?' },
  safety: { label: 'Safety', question: 'Does anyone hurt, threaten, insult or scream at you, or make you feel unsafe?' },
};

export const SOCIAL_SOURCE_NOTE =
  'Based on the five core areas of the CMS Accountable Health Communities screening tool, with simplified wording for the pilot.';

/** "Yes" answers are positive needs; mirrors the database calculation. */
export function positiveDomains(answers: Partial<Record<SocialDomain, SocialAnswer>>): SocialDomain[] {
  return SOCIAL_DOMAINS.filter((d) => answers[d] === 'yes');
}

export function validateSocialScreening(answers: Partial<Record<SocialDomain, SocialAnswer>>, notes = ''): string | null {
  for (const d of SOCIAL_DOMAINS) if (!answers[d]) return `Answer the ${SOCIAL_QUESTIONS[d].label.toLowerCase()} question (choose “Prefers not to say” if needed).`;
  if (notes.trim().length > 1000) return 'Notes are too long (1,000 characters max).';
  if (/\d{3}-\d{2}-\d{4}/.test(notes)) return 'Social Security numbers are not allowed.';
  return null;
}

// ---------- Race-free kidney function (CKD-EPI 2021) ----------

export const EGFR_NOTE =
  'Uses the 2021 CKD-EPI creatinine formula, which does not adjust results by race (National Kidney Foundation and American Society of Nephrology recommendation).';

/** eGFR in mL/min/1.73m² from serum creatinine (mg/dL), age (years) and sex at birth. */
export function egfrCkdEpi2021(creatinineMgDl: number, age: number, sex: 'female' | 'male'): number {
  const female = sex === 'female';
  const k = female ? 0.7 : 0.9;
  const a = female ? -0.241 : -0.302;
  const r = creatinineMgDl / k;
  const v = 142 * Math.pow(Math.min(r, 1), a) * Math.pow(Math.max(r, 1), -1.2) * Math.pow(0.9938, age) * (female ? 1.012 : 1);
  return Math.round(v);
}

/** Kidney-function stage (KDIGO G categories). */
export function egfrStage(egfr: number): string {
  if (egfr >= 90) return 'G1 · normal or high';
  if (egfr >= 60) return 'G2 · mildly decreased';
  if (egfr >= 45) return 'G3a · mildly to moderately decreased';
  if (egfr >= 30) return 'G3b · moderately to severely decreased';
  if (egfr >= 15) return 'G4 · severely decreased';
  return 'G5 · kidney failure';
}

export function ageOn(dob: string, on: string): number {
  const b = new Date(`${dob}T00:00:00`); const d = new Date(`${on}T00:00:00`);
  let age = d.getFullYear() - b.getFullYear();
  const m = d.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && d.getDate() < b.getDate())) age -= 1;
  return age;
}

type LabRow = { record_type: string; status: string; title: string; lab_value?: string | null; lab_unit?: string | null; recorded_on: string };

export type EgfrResult =
  | { ok: true; egfr: number; stage: string; creatinine: number; age: number; date: string }
  | { ok: false; reason: string; both?: { female: number; male: number }; date?: string };

/** Uses the newest active creatinine result in mg/dL. */
export function egfrFromChart(records: LabRow[], dob: string | null | undefined, sex: string | null | undefined): EgfrResult {
  const cr = records
    .filter((r) => r.record_type === 'lab_result' && r.status === 'active' && /creatinine/i.test(r.title) && !/urine|clearance|ratio/i.test(r.title))
    .sort((a, b) => b.recorded_on.localeCompare(a.recorded_on))[0];
  if (!cr) return { ok: false, reason: 'Add a blood creatinine result (mg/dL) to calculate kidney function.' };
  const value = Number(String(cr.lab_value ?? '').replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0 || value > 25) return { ok: false, reason: 'The latest creatinine result is not a usable number.' };
  if (!/mg\s*\/\s*dl/i.test(cr.lab_unit ?? '')) return { ok: false, reason: 'The latest creatinine result must be in mg/dL.' };
  if (!dob) return { ok: false, reason: 'Add a date of birth to calculate kidney function.' };
  const age = ageOn(dob, cr.recorded_on);
  if (age < 18) return { ok: false, reason: 'This adult formula is for patients 18 and older.' };
  if (sex !== 'female' && sex !== 'male') {
    return { ok: false, reason: 'The formula needs sex at birth. Both results are shown.', date: cr.recorded_on,
      both: { female: egfrCkdEpi2021(value, age, 'female'), male: egfrCkdEpi2021(value, age, 'male') } };
  }
  const egfr = egfrCkdEpi2021(value, age, sex);
  return { ok: true, egfr, stage: egfrStage(egfr), creatinine: value, age, date: cr.recorded_on };
}
