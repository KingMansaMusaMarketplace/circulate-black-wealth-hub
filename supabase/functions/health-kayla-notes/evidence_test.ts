import { assertThrows, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { SAMPLE_VISITS, validateNoteLines } from './sample-visits.ts';
Deno.test('note service rejects unsupported assertions and preserves possible injury', () => {
  const visit = SAMPLE_VISITS[2];
  const note = { subjective: [{ text: visit.lines[1], lines: [2] }], objective: [], assessment: [{ text: visit.lines[5], lines: [6] }], plan: [{ text: visit.lines[6], lines: [7] }], flags: [] };
  validateNoteLines(note, visit.lines);
  assertEquals(note.assessment[0].text.includes('cannot confirm'), true);
  note.assessment[0].text = 'Confirmed meniscus injury';
  assertThrows(() => validateNoteLines(note, visit.lines));
});