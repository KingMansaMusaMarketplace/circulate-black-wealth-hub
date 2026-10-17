import { describe, expect, it } from 'vitest';
import { canReview, SAMPLE_CASE_ID, SAMPLE_PAGES, validateSources, type ReviewDraft } from '../../supabase/functions/health-kayla-review/sample-case';

const draft = (page: number, quote: string): ReviewDraft => ({ findings: [{ category: 'timeline', date: '2025-01-10', finding: 'Prior back symptoms recorded', sources: [{ page, quote }] }], questions_for_exam: [], report_outline: [] });
describe('clinical record-review safeguards', () => {
  it('uses a fixed fictional case only', () => { expect(SAMPLE_CASE_ID).toBe('fictional-cme-v1'); expect(SAMPLE_PAGES.every(p => p.text.startsWith('FICTIONAL SAMPLE'))).toBe(true); });
  it('accepts exact page-linked source quotations', () => { expect(() => validateSources(draft(1, 'Intermittent low back pain documented.'))).not.toThrow(); });
  it('rejects fabricated source quotations', () => { expect(() => validateSources(draft(1, 'Patient underwent surgery.'))).toThrow(); });
  it('rejects nonexistent pages', () => { expect(() => validateSources(draft(4000, 'Intermittent low back pain documented.'))).toThrow(); });
  it('rejects findings without sources', () => { const d = draft(1, 'Intermittent low back pain documented.'); d.findings[0].sources = []; expect(() => validateSources(d)).toThrow(); });
  it('requires a doctor or clinic owner for physician review', () => { expect(canReview('doctor')).toBe(true); expect(canReview('owner')).toBe(true); expect(canReview('staff')).toBe(false); expect(canReview('admin')).toBe(false); });
});