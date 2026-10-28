import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { exportFictionalBundle, manifest } from '@/pages/health/workspace/fhir/pilot';
import { originalOutcome, WARNING_REVIEW } from '@/pages/health/workspace/fhir/warning-review';
import outcome from '@/pages/health/workspace/fhir/validator-outcome.json';

describe('fictional warning correction evidence', () => {
  it('preserves all nine original warnings and records seven resolved and two open', () => {
    expect(originalOutcome.issue.filter(i => i.severity === 'warning')).toHaveLength(9);
    expect(WARNING_REVIEW.filter(i => i.status === 'Resolved').map(i => i.number)).toEqual([1, 2, 3, 4, 7, 8, 9]);
    expect(WARNING_REVIEW.filter(i => i.status !== 'Resolved').map(i => i.number)).toEqual([5, 6]);
    expect(outcome.issue.filter(i => i.severity === 'warning').map(i => i.code)).toEqual(['not-found', 'code-invalid']);
    expect(outcome.issue.filter(i => ['error', 'fatal'].includes(i.severity))).toHaveLength(0);
  });
  it('attributes the performer only to the existing inactive fictional professional', () => {
    const packet = JSON.parse(exportFictionalBundle());
    expect(packet.entry[1].resource.performer).toEqual([{ reference: packet.entry[3].fullUrl }]);
    expect(packet.entry[3].resource.active).toBe(false);
    expect(packet.entry[1].resource.valueQuantity).toMatchObject({ value: 36.8, system: 'http://unitsofmeasure.org', code: 'Cel' });
  });
  it('retains the required Kenya coding without the conflicting standard FI workaround', () => {
    const packet = JSON.parse(exportFictionalBundle());
    expect(packet.entry[2].resource.identifier[0].type.coding).toEqual([{ system: 'https://fhir.dha.go.ke/fhir/terminology/CodeSystem/facility-identifier-types', code: 'fid', display: 'Facility ID' }]);
    expect(exportFictionalBundle()).not.toContain('29468');
  });
  it('pins raw archived input, outcome and exact revised export separately', () => {
    const hash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
    const base = 'src/pages/health/workspace/fhir/';
    expect(hash(base + 'sample-bundle-original.json')).toBe(manifest.originalValidation.inputFileSha256);
    expect(hash(base + 'validator-outcome-original.json')).toBe(manifest.originalValidation.outcomeSha256);
    expect(hash(base + 'validator-outcome.json')).toBe(manifest.validatorOutcomeSha256);
    expect(createHash('sha256').update(exportFictionalBundle()).digest('hex')).toBe(manifest.validatorInputSha256);
  });
});