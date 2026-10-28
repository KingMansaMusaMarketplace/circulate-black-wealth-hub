import { describe, it, expect } from 'vitest';
import { checkFictionalRoundTrip, exportFictionalBundle, manifest, PILOT_CAPABILITIES } from '@/pages/health/workspace/fhir/pilot';
import { createHash } from 'node:crypto';
import outcome from '@/pages/health/workspace/fhir/validator-outcome.json';

describe('Independent Kenya FHIR fictional pilot', () => {
  it('pins Kenya Core 1.0.0 and FHIR R4 4.0.1', () => {
    expect(manifest.package).toBe('ke.fhir.core'); expect(manifest.version).toBe('1.0.0'); expect(manifest.fhirVersion).toBe('4.0.1');
  });
  it('preserves exact synthetic temperature, unit, date and references on read-back', () => {
    expect(checkFictionalRoundTrip(exportFictionalBundle())).toEqual({ temperature: 36.8, unit: 'Cel', date: '2026-10-19T12:00:00Z', synthetic: true, resourceCount: 5, facilityType: 'GP-GENERAL-PRACTITIONER-SITE', professionalRole: 'GENERAL-PRACTITIONER', specialty: 'MEDICAL-DOCTOR' });
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
  it('pins the exact exported bytes to recorded validation evidence', () => {
    expect(createHash('sha256').update(exportFictionalBundle()).digest('hex')).toBe(manifest.sampleSha256);
    expect(outcome.issue.filter(i => ['error', 'fatal'].includes(i.severity))).toHaveLength(0);
    expect(outcome.issue.filter(i => i.severity === 'warning')).toHaveLength(2);
    expect(manifest.validatorInputSha256).toBe(manifest.sampleSha256);
  });
  it('resolves every reference inside the five-resource fictional collection', () => {
    const packet = JSON.parse(exportFictionalBundle());
    const urls = packet.entry.map((e: { fullUrl: string }) => e.fullUrl);
    const references = [...exportFictionalBundle().matchAll(/"reference": "([^"]+)"/g)].map(m => m[1]);
    expect(references).toHaveLength(4);
    for (const reference of references) expect(urls).toContain(reference);
  });
  it('keeps the real public facility code outside fictional care and professional IDs unissued', () => {
    const packet = JSON.parse(exportFictionalBundle());
    expect(exportFictionalBundle()).not.toContain('29468');
    expect(packet.entry.slice(2).map((e: { resource: { active: boolean } }) => e.resource.active)).toEqual([false, false, false]);
    expect(packet.entry[3].resource.identifier).toHaveLength(3);
    for (const id of packet.entry[3].resource.identifier) expect(id.value).toMatch(/^SYNTHETIC-NOT-ISSUED-/);
  });
  it('rejects changed professional codes, identifier slices, extra fields and organization references', () => {
    for (const [original, replacement] of [['GENERAL-PRACTITIONER', 'DOCTOR'], ['MEDICAL-DOCTOR', 'GENERAL-PHYSICIAN'], ['PractitionerRegistryID', 'OtherRegistry'], ['SYNTHETIC-NOT-ISSUED-FACILITY-1325', '29468'], ['33333333-3333-4333-8333-333333333333', '66666666-6666-4666-8666-666666666666']]) {
      expect(() => checkFictionalRoundTrip(exportFictionalBundle().replace(original, replacement))).toThrow();
    }
    const packet = JSON.parse(exportFictionalBundle()); packet.entry[3].resource.extra = 'not allowed';
    expect(() => checkFictionalRoundTrip(JSON.stringify(packet))).toThrow();
  });
});