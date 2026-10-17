import { findVisit } from './sample-visits';

export type PrepFact = { text: string; line: number };
export type ChartPrep = {
  visitId: string;
  title: string;
  sections: { label: string; facts: PrepFact[] }[];
  gaps: string[];
};

// Prior fictional visit excerpts, not a new diagnosis or a completed current visit.
const SOURCES: Record<string, { label: string; lines: number[] }[]> = {
  'visit-back-pain-v1': [
    { label: 'Prior symptoms', lines: [2, 3, 4] },
    { label: 'Prior exam', lines: [5, 6] },
    { label: 'Prior clinician assessment', lines: [7] },
    { label: 'Prior plan & follow-up', lines: [8, 9] },
  ],
  'visit-blood-pressure-v1': [
    { label: 'Prior symptoms & medication history', lines: [2, 3] },
    { label: 'Prior exam', lines: [4, 5] },
    { label: 'Prior clinician assessment', lines: [6] },
    { label: 'Prior plan & follow-up', lines: [7, 8] },
  ],
  'visit-knee-v1': [
    { label: 'Prior symptoms', lines: [2, 3] },
    { label: 'Prior exam', lines: [4, 5] },
    { label: 'Prior clinician assessment', lines: [6] },
    { label: 'Prior plan & follow-up', lines: [7, 8] },
  ],
};

export function prepareSampleChart(visitId: string): ChartPrep {
  const visit = findVisit(visitId);
  const mapping = SOURCES[visitId];
  if (!visit || !mapping) throw new Error('Only built-in fictional visits are available.');
  const sections = mapping.map(({ label, lines }) => ({
    label,
    facts: lines.map((line) => {
      const text = visit.lines[line - 1];
      if (!text) throw new Error('The sample source could not be verified.');
      return { text, line };
    }),
  }));
  const gaps = [
    'Visit date is not provided; the timing of these findings cannot be verified.',
    'Allergy history is not provided. This does not mean there are no allergies.',
    'A complete medication list, names and doses are not provided.',
    'There is no subsequent visit in this sample; current symptoms and outcomes are unknown.',
  ];
  if (visitId === 'visit-knee-v1') gaps.push('An MRI was planned; no imaging result is included.');
  if (visitId === 'visit-blood-pressure-v1') gaps.push('Home blood pressure monitoring was requested; no subsequent log is included.');
  return { visitId, title: visit.title, sections, gaps };
}