import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ShaClaimsPilot from '@/pages/health/workspace/ShaClaimsPilot';
import { SHA_CAPABILITIES, SHA_SCENARIOS, shaSample, validateShaSample, rehearseShaReview } from '@/pages/health/workspace/sha-claims';
afterEach(cleanup);
describe('independent fictional Kenya SHA claims', () => {
  it('never enables patient intake, transport, storage, exports, payments or approval', () => {
    expect(SHA_CAPABILITIES).toEqual({ network: false, patientInput: false, persistence: false, export: false, submission: false, payment: false, approval: false });
  });
  it('passes only local complete-sample checks without certifying SHA acceptance', () => {
    const result = validateShaSample(shaSample('complete'));
    expect(result.locallyComplete).toBe(true);
    expect([result.officialSchemaValidated, result.shaAccepted, result.transmitted]).toEqual([false, false, false]);
    expect([result.actualCoverage, result.paidAmount]).toEqual([null, null]);
  });
  it('blocks missing documents', () => {
    expect(validateShaSample(shaSample('missing-document')).locallyComplete).toBe(false);
    expect(() => rehearseShaReview(shaSample('missing-document'), 'pending')).toThrow();
  });
  it('does not infer coverage when unknown', () => {
    const result = validateShaSample(shaSample('coverage-unknown'));
    expect(result.locallyComplete).toBe(false);
    expect(result.actualCoverage).toBeNull();
  });
  it('rejects changed fields and extra patient data', () => {
    const packet = shaSample('complete');
    for (const key of Object.keys(packet)) expect(() => validateShaSample({ ...packet, [key]: 'altered' } as typeof packet)).toThrow();
    expect(() => validateShaSample({ ...packet, patientName: 'real input' } as typeof packet)).toThrow();
  });
  it('keeps scripted review distinct from SHA responses, identifiers and reimbursement', () => {
    for (const outcome of ['pending', 'return'] as const) {
      const result = rehearseShaReview(shaSample('complete'), outcome);
      expect([result.shaResponse, result.claimId, result.paidAmount]).toEqual([null, null, null]);
      expect(result.transmitted).toBe(false);
    }
  });
  it('resets check and review when scenario changes', () => {
    render(<ShaClaimsPilot />);
    fireEvent.click(screen.getByRole('button', { name: 'Check fictional packet' }));
    fireEvent.click(screen.getByRole('button', { name: 'Rehearse pending review' }));
    expect(screen.getAllByRole('status')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Unknown coverage' }));
    expect(screen.queryAllByRole('status')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Rehearse pending review' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Check fictional packet' }));
    expect(screen.getByRole('button', { name: 'Rehearse pending review' })).toBeDisabled();
    for (const name of ['Send to SHA', 'Export SHA claim', 'Record reimbursement']) expect(screen.getByRole('button', { name })).toBeDisabled();
  });
  it('uses separate fixed samples with no link to clinical charts', () => {
    for (const scenario of SHA_SCENARIOS) expect(shaSample(scenario).sampleMember).toBe('FICTIONAL-MEMBER-001');
  });
});