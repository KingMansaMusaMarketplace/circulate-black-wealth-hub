import { z } from 'zod';
import { intakeAvailability } from './intake-policy';

export const SEARCH_MEDICINES = ['Metformin', 'Lisinopril', 'Gabapentin'] as const;
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((s) => {
  const parsed = new Date(`${s}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === s;
}, 'Enter a valid date.');
export const cohortCriteriaSchema = z.object({
  medicine: z.enum(SEARCH_MEDICINES), threshold: z.number().finite().min(0).max(20),
  unit: z.literal('mg/dL'), from: date, to: date,
}).strict().refine((c) => c.from <= c.to, 'Start date must not follow end date.');
export type CohortCriteria = z.infer<typeof cohortCriteriaSchema>;
export type SearchCase = {
  id: string; title: string; source: readonly string[];
  medicines: readonly string[] | null; medicineLine: number | null;
  lab: { value: number; unit: 'mg/dL'; date: string; line: number } | null;
};

/** Independent synthetic query-engine packet. Never merged into charts, notes or signed records. */
export const SEARCH_CASES: readonly SearchCase[] = [
  { id: 'search-a', title: 'Search rehearsal A', source: [
    'Synthetic search fixture A — not a patient chart or a clinical encounter.',
    'Fictional medication snapshot: Metformin; Lisinopril.',
    'Fictional laboratory result: creatinine 1.6 mg/dL, specimen date 2026-10-01.',
  ], medicines: ['Metformin', 'Lisinopril'], medicineLine: 2, lab: { value: 1.6, unit: 'mg/dL', date: '2026-10-01', line: 3 } },
  { id: 'search-b', title: 'Search rehearsal B', source: [
    'Synthetic search fixture B — not a patient chart or a clinical encounter.',
    'Fictional medication snapshot: Metformin.',
    'Fictional laboratory result: creatinine 0.9 mg/dL, specimen date 2026-10-02.',
  ], medicines: ['Metformin'], medicineLine: 2, lab: { value: 0.9, unit: 'mg/dL', date: '2026-10-02', line: 3 } },
  { id: 'search-c', title: 'Search rehearsal C', source: [
    'Synthetic search fixture C — not a patient chart or a clinical encounter.',
    'Fictional medication snapshot: Gabapentin.',
    'No creatinine result is supplied in this synthetic packet.',
  ], medicines: ['Gabapentin'], medicineLine: 2, lab: null },
  { id: 'search-d', title: 'Search rehearsal D', source: [
    'Synthetic search fixture D — not a patient chart or a clinical encounter.',
    'Medication reconciliation is unavailable in this synthetic packet.',
    'Fictional laboratory result: creatinine 1.8 mg/dL, specimen date 2026-10-03.',
  ], medicines: null, medicineLine: null, lab: { value: 1.8, unit: 'mg/dL', date: '2026-10-03', line: 3 } },
];

export const SEARCH_QUESTIONS = SEARCH_MEDICINES.map((medicine) => ({ medicine,
  text: `Find all patients on ${medicine} who have elevated creatinine`,
}));
export const DEFAULT_CRITERIA: CohortCriteria = { medicine: 'Metformin', threshold: 1.2, unit: 'mg/dL', from: '2026-10-01', to: '2026-10-31' };

export function searchCohort(input: unknown) {
  const criteria = cohortCriteriaSchema.parse(input);
  const cases = SEARCH_CASES.map((record) => {
    const drugMatch = record.medicines === null ? null : record.medicines.includes(criteria.medicine);
    const labMatch = !record.lab || record.lab.date < criteria.from || record.lab.date > criteria.to
      ? null : record.lab.value > criteria.threshold;
    const status = drugMatch === false || labMatch === false ? 'excluded' : drugMatch === null || labMatch === null ? 'unknown' : 'matched';
    const reasons = [drugMatch === null ? 'Medication reconciliation unavailable.' : drugMatch ? `${criteria.medicine} appears in the fictional snapshot.` : `${criteria.medicine} does not appear in the fictional snapshot.`,
      labMatch === null ? 'No creatinine result within the selected dates.' : labMatch ? 'Creatinine exceeds the selected threshold.' : 'Creatinine does not exceed the selected threshold.'];
    return { ...record, status, reasons };
  });
  return { criteria, cases, liveRecordsAllowed: intakeAvailability().cmeUpload,
    canExport: false as const, canRecruit: false as const, canSubmitReport: false as const };
}