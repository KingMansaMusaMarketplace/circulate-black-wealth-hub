import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import BillingPreparation from '@/pages/health/workspace/BillingPreparation';
import { billingPreparation } from '@/pages/health/workspace/billing-preparation';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';

afterEach(cleanup);
describe('fictional billing safeguards', () => {
  it('keeps insurance, claims, collection, export and approval locked', () => {
    for (const visit of SAMPLE_VISITS) {
      const state = billingPreparation(visit.id);
      expect([state.canCheckInsurance, state.canSubmitClaim, state.canCollectPayment, state.canExport, state.canApprove]).toEqual([false, false, false, false, false]);
      expect(state.healthcareClearance).toBe('blocked');
    }
  });
  it('does not invent coverage, claims, payment or review results', () => {
    const state = billingPreparation(SAMPLE_VISITS[0].id);
    expect([state.eligibility, state.claimStatus, state.paymentStatus, state.reviewStatus]).toEqual(['not_checked', 'not_prepared', 'no_record', 'unapproved']);
  });
  it('keeps missing identifiers and amounts unknown, not zero', () => {
    const state = billingPreparation(SAMPLE_VISITS[0].id);
    expect([state.payer, state.memberId, state.serviceDate, state.claimId, state.charges, state.paidAmount, state.patientResponsibility]).toEqual([null, null, null, null, null, null, null]);
  });
  it('suggests no codes or visit levels', () => {
    for (const visit of SAMPLE_VISITS) {
      const state = billingPreparation(visit.id);
      expect(state.diagnosisCodes).toEqual([]);
      expect(state.procedureCodes).toEqual([]);
      expect(state.documentation.suggestsCodes).toBe(false);
      expect(state.documentation.canSubmitClaim).toBe(false);
    }
  });
  it('uses exact source quotations for all documentation evidence', () => {
    for (const visit of SAMPLE_VISITS) for (const finding of billingPreparation(visit.id).documentation.found) expect(finding.quote).toBe(visit.lines[finding.line - 1]);
  });
  it('rejects arbitrary visits', () => { expect(() => billingPreparation('real-record')).toThrow(); });
  it('resets evidence and stage when the fictional case changes', () => {
    render(<BillingPreparation />);
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Claim preparation' }), { button: 0, ctrlKey: false });
    fireEvent.click(screen.getByRole('button', { name: 'View source L7: Assessment' }));
    expect(document.getElementById('billing-source-7')).toHaveAttribute('aria-current', 'true');
    fireEvent.click(screen.getByRole('button', { name: SAMPLE_VISITS[2].title }));
    expect(screen.getByRole('tab', { name: 'Insurance checks' })).toHaveAttribute('aria-selected', 'true');
    expect(document.getElementById('billing-source-7')).not.toHaveAttribute('aria-current');
    for (const name of ['Check insurance', 'Submit claim', 'Collect payment', 'Export claim']) expect(screen.getByRole('button', { name })).toBeDisabled();
  });
});