import { describe, expect, it } from 'vitest';
import { billingSimulation, BILLING_SIMULATIONS } from '@/pages/health/workspace/billing-simulation';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';

describe('billing simulation', () => {
  it('covers every fictional visit and never goes live', () => {
    for (const v of SAMPLE_VISITS) {
      const s = billingSimulation(v.id);
      expect(s.live).toBe(false);
      expect(s.transmitted).toBe(false);
      expect(s.saved).toBe(false);
    }
    expect(Object.keys(BILLING_SIMULATIONS).length).toBe(SAMPLE_VISITS.length);
  });
  it('blood pressure visit totals $185 and quality measure is not met at 142/90', () => {
    const s = billingSimulation('visit-blood-pressure-v1');
    expect(s.totalCharge).toBe(185);
    expect(s.mips.result).toBe('Not met');
  });
  it('code source lines exist in the transcript', () => {
    for (const v of SAMPLE_VISITS) for (const c of billingSimulation(v.id).codes) expect(c.sourceLine).toBeLessThanOrEqual(v.lines.length);
  });
  it('rejects unknown visits', () => { expect(() => billingSimulation('real-patient')).toThrow(); });
});
