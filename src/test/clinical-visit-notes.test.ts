import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import * as server from '../../supabase/functions/health-kayla-notes/sample-visits';
import * as display from '@/pages/health/workspace/sample-visits';

const good = { subjective: [{ text: 'Pain 4/10', lines: [2] }], objective: [], assessment: [], plan: [{ text: 'Home exercises', lines: [8] }], flags: [] };

describe('AI note-taking safety', () => {
  it('screen shows the exact same fictional visits the server uses', () => {
    expect(display.SAMPLE_VISITS).toEqual(server.SAMPLE_VISITS);
  });
  it('accepts a note where every item cites a real line', () => {
    expect(() => server.validateNoteLines(good, 9)).not.toThrow();
  });
  it('rejects a note citing a line that does not exist', () => {
    expect(() => server.validateNoteLines({ ...good, plan: [{ text: 'MRI', lines: [42] }] }, 9)).toThrow();
  });
  it('rejects a note item with no citation', () => {
    expect(() => server.validateNoteLines({ ...good, assessment: [{ text: 'Invented diagnosis', lines: [] }] }, 9)).toThrow();
  });
  it('only doctors and owners can sign', () => {
    expect(server.canSign('doctor')).toBe(true);
    expect(server.canSign('owner')).toBe(true);
    expect(server.canSign('staff')).toBe(false);
  });
  it('server rejects anything except built-in visit ids (no uploads)', () => {
    const src = readFileSync('supabase/functions/health-kayla-notes/index.ts', 'utf8');
    expect(src).toContain('z.enum(visitIds)');
    expect(src).toContain('.strict()');
  });
});
