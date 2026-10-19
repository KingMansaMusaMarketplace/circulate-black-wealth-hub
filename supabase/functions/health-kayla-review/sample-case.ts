// Immutable fictional records. Never replace these with patient uploads.
export const SAMPLE_CASE_ID = 'fictional-cme-v1';
export const SAMPLE_PAGES = [
  { page: 1, file: '01_Pre-incident.txt', date: '2025-01-10', text: 'FICTIONAL SAMPLE — Jordan Sample. Sample Primary Care. Intermittent low back pain documented. No leg weakness reported. Conservative care discussed.' },
  { page: 2, file: '02_Incident-and-ER.txt', date: '2025-03-02', text: 'FICTIONAL SAMPLE — Jordan Sample. Sample General ER. Motor vehicle collision on 2025-03-02. Patient reports new low back pain and denies prior back symptoms. Examination: strength 5/5 in both legs. No fracture on lumbar radiographs. Follow-up advised.' },
  { page: 3, file: '03_Imaging.txt', date: '2025-03-18', text: 'FICTIONAL SAMPLE — Jordan Sample. Sample Imaging Center. Lumbar MRI describes L4-L5 disc protrusion and mild nerve contact. No prior MRI provided for comparison. This imaging report does not establish when the protrusion developed.' },
  { page: 4, file: '04_Therapy.txt', date: '2025-04-01', text: 'FICTIONAL SAMPLE — Jordan Sample. Sample Physical Therapy. Patient reports persistent low back pain. Exercises documented. A further appointment was planned for 2025-04-08. No attendance record for that appointment is included in this sample bundle.' },
  { page: 5, file: '05_Follow-up.txt', date: '2025-05-20', text: 'FICTIONAL SAMPLE — Jordan Sample. Sample Spine Clinic. Patient reports right leg weakness. Examination records strength 5/5 bilaterally. These entries differ but do not prove fabrication or rule out symptoms. Physician assessment required.' },
  { page: 6, file: '06_Record-index.txt', date: 'Not stated', text: 'FICTIONAL SAMPLE — Bundle index. Included: primary care, emergency visit, MRI, therapy and spine follow-up. Missing from this bundle: prior MRI comparison and therapy attendance after 2025-04-01. Missing documents do not prove missing treatment. No causation, disability or legal opinion is supplied.' },
] as const;

export type Source = { page: number; quote: string };
export type Finding = { category: 'timeline' | 'pre_existing' | 'conflict' | 'gap'; date: string; finding: string; sources: Source[] };
export type ReviewDraft = { findings: Finding[]; questions_for_exam: string[]; report_outline: string[] };

export function validateSources(draft: ReviewDraft, exactAssertions = false): void {
  if (!draft.findings.length) throw new Error('No source-linked findings returned');
  for (const finding of draft.findings) {
    if (!finding.sources.length) throw new Error('Finding has no source');
    if (exactAssertions && finding.finding !== finding.sources.map(s => s.quote).join(' ')) throw new Error('Unsupported narrative assertion');
    for (const source of finding.sources) {
      const page = SAMPLE_PAGES.find((p) => p.page === source.page);
      if (!page || source.quote.trim().length < 8 || !page.text.includes(source.quote)) {
        throw new Error('Citation could not be verified against the sample record');
      }
    }
  }
}

/** Old saved drafts must still match today's immutable packet before acceptance. */
export function validateSavedReview(value: unknown): void {
  if (!value || typeof value !== 'object') throw new Error('Missing saved review');
  const saved = value as Record<string, unknown>;
  if (saved.sample_case_id !== SAMPLE_CASE_ID || !Array.isArray(saved.source_pages) || saved.source_pages.length !== SAMPLE_PAGES.length) throw new Error('Unrecognized saved source packet');
  const sourcePages = saved.source_pages;
  SAMPLE_PAGES.forEach((page, index) => {
    const candidate = sourcePages[index] as Record<string, unknown> | undefined;
    if (!candidate || candidate.page !== page.page || candidate.file !== page.file || candidate.date !== page.date || candidate.text !== page.text) throw new Error('Saved source packet changed');
  });
  if (!Array.isArray(saved.findings) || !Array.isArray(saved.questions_for_exam) || !Array.isArray(saved.report_outline)) throw new Error('Malformed saved review');
  const draft = saved as unknown as ReviewDraft;
  validateSources(draft, true);
  for (const finding of draft.findings) {
    if (!['timeline', 'pre_existing', 'conflict', 'gap'].includes(finding.category)) throw new Error('Invalid saved grouping');
    const date = [...new Set(finding.sources.map(source => SAMPLE_PAGES.find(page => page.page === source.page)?.date ?? 'Not stated'))].join(' / ');
    if (finding.date !== date) throw new Error('Saved date differs from source');
  }
}

export function canReview(role: string): boolean { return role === 'owner' || role === 'doctor'; }