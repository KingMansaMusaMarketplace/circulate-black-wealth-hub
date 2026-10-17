import { SAMPLE_CASE_ID, SAMPLE_PAGES } from '../../../../supabase/functions/health-kayla-review/sample-case';

export type EventKind = 'history' | 'incident' | 'imaging' | 'therapy' | 'follow_up' | 'index';
export type ChronologySource = { page: number; quote: string };
export type ChronologyEvent = { page: number; file: string; date: string | null; kind: EventKind; title: string; text: string };
export type ChronologyFlag = { title: string; detail: string; sources: ChronologySource[] };
const CLASSIFICATION: { kind: EventKind; title: string }[] = [
  { kind: 'history', title: 'Pre-incident primary care' },
  { kind: 'incident', title: 'Collision & emergency visit' },
  { kind: 'imaging', title: 'Lumbar MRI' },
  { kind: 'therapy', title: 'Physical therapy visit' },
  { kind: 'follow_up', title: 'Spine follow-up' },
  { kind: 'index', title: 'Bundle index — date unavailable' },
];

export function buildSampleChronology(caseId: string) {
  if (caseId !== SAMPLE_CASE_ID) throw new Error('Only the built-in fictional case is available.');
  const events: ChronologyEvent[] = SAMPLE_PAGES.map((page, index) => {
    const category = CLASSIFICATION[index];
    if (!category) throw new Error('Sample classification unavailable.');
    return { ...page, date: page.date === 'Not stated' ? null : page.date, ...category };
  }).sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999') || a.page - b.page);
  const flags: ChronologyFlag[] = [
    { title: 'Prior symptom history differs', detail: 'Primary care documents earlier back pain; the emergency record reports denial of prior symptoms. Reconcile with a physician; do not infer dishonesty.', sources: [
      { page: 1, quote: 'Intermittent low back pain documented.' },
      { page: 2, quote: 'Patient reports new low back pain and denies prior back symptoms.' },
    ] },
    { title: 'Imaging onset cannot be established', detail: 'No prior MRI comparison is supplied. The imaging date is not the date the protrusion developed.', sources: [
      { page: 3, quote: 'No prior MRI provided for comparison.' },
      { page: 3, quote: 'This imaging report does not establish when the protrusion developed.' },
    ] },
    { title: 'Planned attendance is unverified', detail: 'April 8 was planned, not a confirmed visit. Missing attendance documentation does not prove missed treatment.', sources: [
      { page: 4, quote: 'A further appointment was planned for 2025-04-08. No attendance record for that appointment is included in this sample bundle.' },
      { page: 6, quote: 'Missing documents do not prove missing treatment.' },
    ] },
    { title: 'Reported weakness & exam differ', detail: 'Preserve both the patient report and recorded strength. A physician must interpret the difference.', sources: [
      { page: 5, quote: 'Patient reports right leg weakness. Examination records strength 5/5 bilaterally.' },
      { page: 5, quote: 'These entries differ but do not prove fabrication or rule out symptoms.' },
    ] },
    { title: 'Index date missing', detail: 'The index is shown separately from dated clinical events; no date is inferred.', sources: [
      { page: 6, quote: 'FICTIONAL SAMPLE — Bundle index.' },
    ] },
  ];
  for (const flag of flags) {
    for (const source of flag.sources) {
      const page = SAMPLE_PAGES.find((item) => item.page === source.page);
      if (!page?.text.includes(source.quote)) throw new Error('Chronology source could not be verified.');
    }
  }
  return { caseId, events, flags };
}

export function filterChronology(events: ChronologyEvent[], kind: EventKind | 'all') {
  return kind === 'all' ? events : events.filter((event) => event.kind === kind);
}