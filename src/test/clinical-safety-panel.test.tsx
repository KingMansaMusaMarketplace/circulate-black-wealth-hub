import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ClinicalSafetyPanel from '@/pages/health/ClinicalSafetyPanel';
import { clinicalSafety } from '@/pages/health/workspace/clinical-safety';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';
afterEach(cleanup);
describe('clinical advisory safety boundaries', () => {
  it('retains unknown allergies and uncompleted reconciliation for every fixture', () => {
    for (const visit of SAMPLE_VISITS) expect([clinicalSafety(visit.id).allergyStatus, clinicalSafety(visit.id).reconciliation]).toEqual(['unknown', 'not_completed']);
  });
  it('never claims performed screening, risk scoring or independent validation', () => {
    for (const visit of SAMPLE_VISITS) {
      const state = clinicalSafety(visit.id);
      expect([state.interactionStatus, state.doseSafetyStatus, state.riskScore, state.clinicalValidation]).toEqual(['not_checked', 'not_checked', null, 'not_verified']);
    }
  });
  it('does not unlock approval, screening, prescribing, export, delivery or live services', () => {
    const state = clinicalSafety('visit-blood-pressure-v1');
    expect([state.canApprove, state.canScreen, state.canPrescribe, state.canExport, state.canSend]).toEqual([false, false, false, false, false]);
    expect(state.intake).toEqual({ agreementUpload: false, cmeUpload: false, patientCalls: false });
    expect(state.reviewStatus).toBe('awaiting_clinician_review');
  });
  it('uses exact existing numbered evidence and rejects unknown records', () => {
    for (const visit of SAMPLE_VISITS) for (const item of clinicalSafety(visit.id).evidence) expect(item.text).toBe(visit.lines[item.line - 1]);
    expect(clinicalSafety('visit-knee-v1').evidence.map((item) => item.line)).toEqual([5, 6, 8]);
    expect(() => clinicalSafety('real-patient')).toThrow();
  });
  it('preserves planned imaging and dose discussions rather than completed results', () => {
    expect(clinicalSafety('visit-knee-v1').gaps).toContain('An MRI was planned; no imaging result is included.');
    expect(clinicalSafety('visit-blood-pressure-v1').evidence[1].text).toBe(SAMPLE_VISITS[1].lines[6]);
  });
  it('clears selected source on case change and close/reopen', () => {
    render(<ClinicalSafetyPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Clinical safety' }));
    fireEvent.click(screen.getByRole('button', { name: /Historical clinician impression/ }));
    expect(screen.getByRole('region', { name: 'Safety source transcript' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: SAMPLE_VISITS[2].title }));
    expect(screen.queryByRole('region', { name: 'Safety source transcript' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Unconfirmed historical assessment/ }));
    const source = screen.getByRole('region', { name: 'Safety source transcript' });
    expect(within(source).getByText(SAMPLE_VISITS[2].lines[5])).toBeInTheDocument();
    expect(within(source).queryByText(SAMPLE_VISITS[0].lines[6])).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close', exact: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Clinical safety' }));
    expect(screen.queryByRole('region', { name: 'Safety source transcript' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: SAMPLE_VISITS[0].title })).toHaveAttribute('aria-pressed', 'true');
  });
});