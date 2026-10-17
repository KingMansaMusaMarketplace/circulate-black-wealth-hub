import { describe, expect, it } from 'vitest';
import { checkSampleDocumentation } from '@/pages/health/workspace/documentation-check';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';

describe('fictional billing documentation check', () => {
  it('rejects non-sample records', () => {
    expect(() => checkSampleDocumentation('real-patient')).toThrow();
  });
  it('cites exact transcript quotes', () => {
    for (const v of SAMPLE_VISITS) for (const f of checkSampleDocumentation(v.id).found) expect(f.quote).toBe(v.lines[f.line - 1]);
  });
  it('never suggests billing codes or allows claim submission', () => {
    for (const v of SAMPLE_VISITS) {
      const r = checkSampleDocumentation(v.id);
      expect(r.suggestsCodes).toBe(false);
      expect(r.canSubmitClaim).toBe(false);
      expect(JSON.stringify(r)).not.toMatch(/\b(99\d{3}|[A-Z]\d{2}\.\d)/);
    }
  });
  it('flags missing medicine name for the blood pressure visit', () => {
    expect(checkSampleDocumentation('visit-blood-pressure-v1').missing.map((m) => m.code)).toContain('medication_name');
  });
});
