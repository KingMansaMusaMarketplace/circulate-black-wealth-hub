import { findVisit } from './sample-visits';

export const SPECIALTIES = ['Primary Care', 'Orthopedics', 'Cardiology'] as const;
export type Specialty = typeof SPECIALTIES[number];
type Section = { title: string; lines: number[] };
export type SpecialtyExample = {
  id: string; specialty: Specialty; title: string; transcript: readonly string[];
  sections: Section[]; gaps: string[];
  fictional: true; reviewStatus: 'awaiting_doctor_review'; canSign: false; canExport: false; canSend: false;
};

const cardiologyTranscript = [
  'Doctor: Casey Example, this is a fictional cardiology consultation for a reported fluttering heartbeat.',
  'Patient: I noticed a fluttering feeling twice last week. I did not write down how long it lasted.',
  'Patient: I have a copy of a heart tracing from another office, but I did not bring it today.',
  'Doctor: The outside tracing is not available in this sample record.',
  'Doctor: I cannot establish the cause from this conversation alone. No diagnosis is confirmed in this example.',
  'Doctor: We will request the outside tracing for review before deciding on further evaluation.',
] as const;

export function getSpecialtyExample(specialty: Specialty): SpecialtyExample {
  const safety = { fictional: true, reviewStatus: 'awaiting_doctor_review', canSign: false, canExport: false, canSend: false } as const;
  if (specialty === 'Cardiology') return {
    ...safety, specialty, id: 'specialty-cardiology-v1', title: 'Reported palpitations — Casey Example', transcript: cardiologyTranscript,
    sections: [{ title: 'Patient report', lines: [2, 3] }, { title: 'Record availability', lines: [4] }, { title: 'Doctor’s assessment', lines: [5] }, { title: 'Doctor’s plan', lines: [6] }],
    gaps: ['Episode duration is not recorded.', 'Outside heart tracing is unavailable; its findings cannot be inferred.', 'No examination findings or vital signs are supplied in this transcript.'],
  };
  const visit = findVisit(specialty === 'Primary Care' ? 'visit-blood-pressure-v1' : 'visit-knee-v1');
  if (!visit) throw new Error('Fictional visit source is unavailable.');
  return {
    ...safety, specialty, id: visit.id, title: visit.title, transcript: visit.lines,
    sections: specialty === 'Primary Care'
      ? [{ title: 'Patient report', lines: [2, 3] }, { title: 'Exam findings', lines: [4, 5] }, { title: 'Doctor’s assessment', lines: [6] }, { title: 'Doctor’s plan', lines: [7, 8] }]
      : [{ title: 'Patient report', lines: [2, 3] }, { title: 'Exam findings', lines: [4, 5] }, { title: 'Doctor’s assessment', lines: [6] }, { title: 'Doctor’s plan', lines: [7, 8] }],
    gaps: specialty === 'Primary Care'
      ? ['Medicine name and dose are not specified.', 'Home blood-pressure log is requested but not supplied.']
      : ['Ligament testing is limited by pain.', 'MRI is planned; no imaging result is available.', 'Possible meniscus injury is not a confirmed diagnosis.'],
  };
}

export function specialtyExcerpt(example: SpecialtyExample, line: number): string {
  if (!Number.isInteger(line) || line < 1 || line > example.transcript.length) throw new Error('Source line does not exist.');
  return example.transcript[line - 1];
}