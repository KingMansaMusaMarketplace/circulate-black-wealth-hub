import { describe, expect, it } from 'vitest';
import { narrationCatalog, visitorAnnouncement } from '@/pages/health/clinical-narration';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';
describe('clinical narration boundaries', () => {
  it('reads each fictional source verbatim with original line numbers', () => {
    for (const visit of SAMPLE_VISITS) expect(narrationCatalog().find(item => item.id === `source-${visit.id}`)?.text).toBe(visit.lines.map((line, i) => `Line ${i + 1}. ${line}`).join(' '));
  });
  it('announces only a positive final two-minute window once', () => {
    expect(visitorAnnouncement(120001, false, false)).toBeNull();
    expect(visitorAnnouncement(120000, false, false)).toBe('time-warning');
    expect(visitorAnnouncement(1000, false, true)).toBeNull();
    expect(visitorAnnouncement(0, false, false)).toBeNull();
  });
  it('announces a confirmed extension without changing access itself', () => {
    expect(visitorAnnouncement(1200000, true, true)).toBe('time-extension');
    expect(visitorAnnouncement(1200000, false, false)).toBeNull();
  });
});
