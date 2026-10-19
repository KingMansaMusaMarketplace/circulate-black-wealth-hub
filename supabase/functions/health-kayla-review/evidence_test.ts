import { assertThrows } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { SAMPLE_CASE_ID, SAMPLE_PAGES, validateSources, validateSavedReview } from './sample-case.ts';
Deno.test('review service rejects narrative not supported by exact cited text', () => {
  assertThrows(() => validateSources({ findings: [{ category: 'timeline', date: '2025-01-10', finding: 'No prior symptoms', sources: [{ page: 1, quote: 'Intermittent low back pain documented.' }] }], questions_for_exam: [], report_outline: [] }, true));
});
Deno.test('review quotations require literal whitespace', () => {
  assertThrows(() => validateSources({ findings: [{ category: 'timeline', date: '2025-01-10', finding: 'Intermittent  low back pain documented.', sources: [{ page: 1, quote: 'Intermittent  low back pain documented.' }] }], questions_for_exam: [], report_outline: [] }, true));
});
const saved = () => ({ sample_case_id: SAMPLE_CASE_ID, source_pages: SAMPLE_PAGES.map(page => ({ ...page })), findings: [{ category: 'timeline', date: '2025-01-10', finding: 'Intermittent low back pain documented.', sources: [{ page: 1, quote: 'Intermittent low back pain documented.' }] }], questions_for_exam: [], report_outline: [] });
Deno.test('saved review acceptance rechecks packet identity and literal assertions', () => {
  validateSavedReview(saved());
  assertThrows(() => validateSavedReview({ ...saved(), sample_case_id: 'unknown' }));
  assertThrows(() => validateSavedReview({ ...saved(), source_pages: [] }));
  assertThrows(() => validateSavedReview({ ...saved(), source_pages: SAMPLE_PAGES.map((page, index) => ({ ...page, text: index === 0 ? 'Altered packet' : page.text })) }));
  const narrative = saved(); narrative.findings[0].finding = 'No prior symptoms';
  assertThrows(() => validateSavedReview(narrative));
  const date = saved(); date.findings[0].date = '2026-10-18';
  assertThrows(() => validateSavedReview(date));
  assertThrows(() => validateSavedReview(null));
});