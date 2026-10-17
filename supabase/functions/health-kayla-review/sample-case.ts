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

export function validateSources(draft: ReviewDraft): void {
  if (!draft.findings.length) throw new Error('No source-linked findings returned');
  for (const finding of draft.findings) {
    if (!finding.sources.length) throw new Error('Finding has no source');
    for (const source of finding.sources) {
      const page = SAMPLE_PAGES.find((p) => p.page === source.page);
      const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
      if (!page || source.quote.trim().length < 8 || !normalize(page.text).includes(normalize(source.quote))) {
        throw new Error('Citation could not be verified against the sample record');
      }
    }
  }
}

export function canReview(role: string): boolean { return role === 'owner' || role === 'doctor'; }