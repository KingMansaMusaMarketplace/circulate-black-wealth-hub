import { describe, expect, it } from 'vitest';
import { getFacilityStatuses } from '@/pages/health/workspace/fhir/facility-status';

describe('Kenya facility export evidence isolation', () => {
  it('has only one tested fictional facility packet with zero errors and two remaining warnings', () => {
    const rows = getFacilityStatuses(false, false);
    expect(rows.filter(r => r.validationDate !== null)).toHaveLength(1);
    expect(rows[0].errors).toBe(0); expect(rows[0].warnings).toBe(2);
    expect(rows[0].findings.filter(i => i.severity === 'warning')).toHaveLength(2);
  });
  it('requires local read-back before making the fictional download available', () => {
    expect(getFacilityStatuses(false, false)[0].exportStatus).toBe('Read-back required');
    expect(getFacilityStatuses(true, false)[0].exportStatus).toBe('Available for local download');
  });
  it('reports a browser download request without claiming delivery', () => {
    expect(getFacilityStatuses(true, true)[0].exportStatus).toBe('Local download requested');
    expect(getFacilityStatuses(true, true).map(r => r.transport)).toEqual(['Not connected', 'Not connected']);
  });
  it('never attributes fictional validation or download status to the real facility', () => {
    for (const state of [[false, false], [true, false], [true, true]]) {
      const reference = getFacilityStatuses(state[0], state[1])[1];
      expect(reference.exportStatus).toBe('No export tested'); expect(reference.warnings).toBeNull();
      expect(reference.errors).toBeNull(); expect(reference.validationDate).toBeNull();
      expect(reference.findings).toEqual([]); expect(reference.readBack).toBe('Not applicable');
    }
  });
});