import { assertThrows } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { validateSources } from './sample-case.ts';
Deno.test('review service rejects narrative not supported by exact cited text', () => {
  assertThrows(() => validateSources({ findings: [{ category: 'timeline', date: '2025-01-10', finding: 'No prior symptoms', sources: [{ page: 1, quote: 'Intermittent low back pain documented.' }] }], questions_for_exam: [], report_outline: [] }, true));
});