import { describe, it, expect } from 'vitest';
import { checkFictionalRoundTrip, exportFictionalBundle, manifest, PILOT_CAPABILITIES } from '@/pages/health/workspace/fhir/pilot';

describe('Independent Kenya FHIR fictional pilot', () => {
  it('pins Kenya Core 1.0.0 and FHIR R4 4.0.1', () => {
    expect(manifest.package).toBe('ke.fhir.core'); expect(manifest.version).toBe('1.0.0'); expect(manifest.fhirVersion).toBe('4.0.1');
  });
  it('preserves exact synthetic temperature, unit, date and references on read-back', () => {
    expect(checkFictionalRoundTrip(exportFictionalBundle())).toEqual({ temperature: 36.8, unit: 'Cel', date: '2026-10-19T12:00:00Z', synthetic: true });
    const value = JSON.parse(exportFictionalBundle()); expect(value.entry[1].resource.subject.reference).toBe(value.entry[0].fullUrl);
  });
  it('rejects altered values, units, references and identities', () => {
    for (const [oldValue, replacement] of [['36.8', '38.2'], ['"Cel"', '"mg"'], ['SYNTHETIC-NOT-ISSUED-1325-001', 'actual-patient'], ['11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333333']]) {
      expect(() => checkFictionalRoundTrip(exportFictionalBundle().replace(oldValue, replacement))).toThrow();
    }
  });
  it('does not enable real intake, persistence, chart import or transport', () => {
    expect(PILOT_CAPABILITIES).toEqual({ exportSynthetic: true, patientInput: false, importChart: false, persist: false, governmentTransport: false });
  });
});