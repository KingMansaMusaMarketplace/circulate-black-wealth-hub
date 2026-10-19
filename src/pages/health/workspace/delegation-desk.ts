// Fixed fictional fixtures for the Delegation Desk rehearsal. No input, network, persistence or transport.

export const DELEGATION_PATIENT = 'Avery Example (fictional)';

/** Numbered fictional chart excerpts used to pre-answer order questions. */
export const DELEGATION_CHART: readonly string[] = [
  'Medication list (sample): Lisinopril 10 mg daily.',
  'Problem list (sample): Hypertension; history of nausea with prior therapy.',
  'Allergies (sample): Penicillin — rash.',
  'Kidney function (sample): creatinine 1.0 mg/dL on 2026-09-02.',
];

/** Fictional spoken request from the doctor; turned into drafts by fixed rules, never by free text. */
export const SPOKEN_REQUEST = 'I need a PET scan in three months before follow-up, a serum PSA before the next visit, and ondansetron 4 mg every 8 hours as needed for nausea, dispense 42, three refills, to Redwood Pharmacy.';

export type OrderQuestion = { question: string; answer: 'yes' | 'no' | 'unknown'; sourceLine: number | null };
export type DraftOrder = { id: string; kind: 'Imaging' | 'Laboratory' | 'Prescription'; summary: string; timing: string; questions: OrderQuestion[] };

export const DRAFT_ORDERS: readonly DraftOrder[] = [
  { id: 'pet', kind: 'Imaging', summary: 'PET scan', timing: 'About 3 months, before follow-up (date not booked)', questions: [
    { question: 'Taking metformin?', answer: 'no', sourceLine: 1 },
    { question: 'Implanted cardiac device?', answer: 'unknown', sourceLine: null },
    { question: 'Recent kidney function on file?', answer: 'yes', sourceLine: 4 },
  ] },
  { id: 'psa', kind: 'Laboratory', summary: 'Serum PSA', timing: 'Before next visit (date not booked)', questions: [
    { question: 'Supporting reason listed in chart?', answer: 'unknown', sourceLine: null },
  ] },
  { id: 'ondansetron', kind: 'Prescription', summary: 'Ondansetron 4 mg every 8 hours as needed for nausea · dispense 42 · 3 refills · Redwood Pharmacy (fictional)', timing: 'On signature', questions: [
    { question: 'Allergies on file?', answer: 'yes', sourceLine: 3 },
    { question: 'Interaction screening performed?', answer: 'unknown', sourceLine: null },
  ] },
];

export type InboxRoute = 'staff_protocol' | 'doctor_judgment';
export type InboxItem = { id: string; type: string; text: string; route: InboxRoute; reason: string };

/** Sample standing rules the doctor would approve in advance (illustrative wording, not legal or clinical policy). */
export const STANDING_RULES: readonly string[] = [
  'Routine refill of a stable, unchanged medicine seen within 12 months → staff prepares, doctor signs.',
  'Forms and records requests → staff completes, doctor signs.',
  'Any new symptom, abnormal result or medicine change → doctor reviews.',
];

export const INBOX_ITEMS: readonly InboxItem[] = [
  { id: 'i1', type: 'Refill request', text: 'Lisinopril 10 mg refill, unchanged dose (sample).', route: 'staff_protocol', reason: 'Matches the routine refill rule.' },
  { id: 'i2', type: 'Form', text: 'Work-status form for a shoulder strain (sample).', route: 'staff_protocol', reason: 'Matches the forms rule.' },
  { id: 'i3', type: 'Records request', text: 'Outside specialist requests visit notes (sample).', route: 'staff_protocol', reason: 'Matches the records rule.' },
  { id: 'i4', type: 'Patient message', text: '"My new medicine makes me dizzy." (sample)', route: 'doctor_judgment', reason: 'New symptom — needs physician judgment.' },
  { id: 'i5', type: 'Result question', text: 'Patient viewed a result before review and is worried (sample).', route: 'doctor_judgment', reason: 'Result explanation — needs physician judgment.' },
];

export const LOCKED_ACTIONS = ['Send to pharmacy', 'Send to laboratory', 'Schedule imaging', 'Submit to insurer', 'Reply to patient'] as const;

export function routedCounts() {
  const staff = INBOX_ITEMS.filter((i) => i.route === 'staff_protocol').length;
  return { staff, doctor: INBOX_ITEMS.length - staff };
}
