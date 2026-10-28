import { describe, expect, it } from 'vitest';
import { EXCHANGE_BOUNDARY, READINESS, filterReadiness, readinessSummary } from '@/pages/health/workspace/national-exchange/readiness';
describe('separate national exchange preparation boundary', () => {
  it('blocks real Kenya data and connections', () => {
    expect(EXCHANGE_BOUNDARY).toEqual({ realData: false, transport: false, credentials: false, imports: false, persistence: false, certification: false });
  });
  it('never promotes fictional readiness to live clearance', () => {
    expect(readinessSummary()).toEqual({ total: 8, sampleEvidence: 1, openFindings: 1, unverified: 6, liveReady: false, readinessPercent: null });
    expect(readinessSummary(READINESS.map(item => ({ ...item, status: 'Sample evidence only' })))).toMatchObject({ sampleEvidence: 8, liveReady: false, readinessPercent: null });
  });
  it('separates recorded findings and unverified national acceptance', () => {
    expect(filterReadiness('Open findings').map(item => item.id)).toEqual(['terminology']);
    expect(filterReadiness('Unverified').map(item => item.id)).toContain('sandbox');
    expect(filterReadiness('Sample evidence only').map(item => item.id)).toEqual(['profiles']);
    expect(filterReadiness('All')).toHaveLength(8);
  });
});