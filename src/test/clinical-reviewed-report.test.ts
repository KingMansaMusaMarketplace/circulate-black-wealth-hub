import { describe, expect, it } from 'vitest';
import { assertExportable, buildReviewedReport } from '@/pages/health/workspace/reviewed-report';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';

const visit = SAMPLE_VISITS[0];
const note = { subjective: [{ text: visit.lines[1], lines: [2] }], plan: [{ text: visit.lines[7], lines: [8] }] };

describe('doctor-reviewed PDF export', () => {
  it('rejects invented text even with an existing citation', () => {
    expect(() => assertExportable({ visitTitle: visit.title, transcript: visit.lines, note: { plan: [{ text: 'Invented treatment', lines: [8] }] }, decision: 'signed', signedAt: '2026-10-17T08:00:00Z' })).toThrow('unsupported');
  });
  it('rejects missing or unsupported flag evidence', () => {
    for (const flag of [{ text: 'Invented flag', lines: [] }, { text: 'Invented flag', lines: [999] }, { text: 'Invented flag', lines: [2] }]) {
      expect(() => assertExportable({ visitTitle: visit.title, transcript: visit.lines, note: { ...note, flags: [flag] }, decision: 'signed', signedAt: '2026-10-17T08:00:00Z' })).toThrow();
    }
  });
  it('refuses unsigned drafts', () => {
    expect(() => assertExportable({ visitTitle: visit.title, transcript: visit.lines, note })).toThrow();
  });
  it('refuses rejected notes', () => {
    expect(() => assertExportable({ visitTitle: visit.title, transcript: visit.lines, note, decision: 'rejected', signedAt: '2026-10-17T08:00:00Z' })).toThrow();
  });
  it('refuses citations to missing transcript lines', () => {
    expect(() => assertExportable({ visitTitle: visit.title, transcript: visit.lines, note: { plan: [{ text: 'x', lines: [99] }] }, decision: 'signed', signedAt: '2026-10-17T08:00:00Z' })).toThrow();
  });
  it('builds a PDF for a signed note', () => {
    const doc = buildReviewedReport({ visitTitle: visit.title, transcript: visit.lines, note, decision: 'signed', signedAt: '2026-10-17T08:00:00Z' });
    expect(doc.output('arraybuffer').byteLength).toBeGreaterThan(1000);
  });
});
