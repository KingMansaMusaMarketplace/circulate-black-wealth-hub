// Display copy of supabase/functions/health-kayla-notes/sample-visits.ts — a test keeps them identical.
export const SAMPLE_VISITS = [
  {
    id: 'visit-back-pain-v1', title: 'Back pain follow-up — Avery Example', lines: [
      'Doctor: Hi Avery, this is a follow-up for your low back pain. This is a fictional sample visit.',
      'Patient: The pain is better than last month, maybe a 4 out of 10 now.',
      'Patient: It still gets worse when I sit at my desk for more than an hour.',
      'Patient: No numbness or tingling in my legs.',
      'Doctor: Your strength is 5 out of 5 in both legs and the straight leg raise is negative.',
      'Doctor: There is mild tenderness over the lower lumbar muscles.',
      'Doctor: My impression is improving mechanical low back pain.',
      'Doctor: Keep doing the home exercises and try standing breaks every 45 minutes.',
      'Doctor: I will see you again in six weeks.',
    ],
  },
  {
    id: 'visit-blood-pressure-v1', title: 'Blood pressure check — Sam Placeholder', lines: [
      'Doctor: Good morning Sam, we are checking your blood pressure today. This is a fictional sample visit.',
      'Patient: I have been taking the pill most days, but I miss it maybe twice a week.',
      'Patient: I get mild headaches in the afternoon sometimes.',
      'Doctor: Today your blood pressure is 142 over 90 and your heart rate is 78.',
      'Doctor: Heart and lung exam sound normal.',
      'Doctor: Your blood pressure is still above goal.',
      'Doctor: Let us work on taking the medicine every day, and I may adjust the dose next time.',
      'Doctor: Please check your blood pressure at home and bring the log in four weeks.',
    ],
  },
  {
    id: 'visit-knee-v1', title: 'Knee injury — Riley Demo', lines: [
      'Doctor: Riley, tell me about your knee. This is a fictional sample visit.',
      'Patient: I twisted my right knee playing basketball three days ago.',
      'Patient: It swelled up the same night and it is hard to fully straighten it.',
      'Doctor: There is moderate swelling of the right knee and tenderness along the inside joint line.',
      'Doctor: Ligament testing is limited today because of pain.',
      'Doctor: I am concerned about a possible meniscus injury, but I cannot confirm that today.',
      'Doctor: Use ice, rest, and the knee brace for now.',
      'Doctor: We will order an MRI of the right knee.',
    ],
  },
] as const;

export type NoteItem = { text: string; lines: number[] };
export type VisitNote = { subjective: NoteItem[]; objective: NoteItem[]; assessment: NoteItem[]; plan: NoteItem[]; flags: NoteItem[] };

export const findVisit = (id: string) => SAMPLE_VISITS.find((v) => v.id === id) ?? null;

/** Every item must cite at least one real transcript line. Throws on any invented or missing citation. */
export function validateNoteLines(note: VisitNote, lineCount: number) {
  for (const key of ['subjective', 'objective', 'assessment', 'plan', 'flags'] as const) {
    for (const item of note[key]) {
      if (key !== 'flags' && item.lines.length === 0) throw new Error(`Uncited ${key} item`);
      for (const n of item.lines) if (!Number.isInteger(n) || n < 1 || n > lineCount) throw new Error(`Line ${n} does not exist`);
    }
  }
  if (!note.subjective.length || !note.plan.length) throw new Error('Note is missing required sections');
}

export const canSign = (role: string) => role === 'owner' || role === 'doctor';
