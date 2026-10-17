import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import MedicationReview from '@/pages/health/workspace/MedicationReview';
import { prepareMedicationReview } from '@/pages/health/workspace/medication-review';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';

afterEach(cleanup);
describe('fictional medication-review safeguards', () => {
  it('uses exact medicine references from the selected transcript', () => {
    expect(prepareMedicationReview('visit-blood-pressure-v1').evidence.map((item) => item.line)).toEqual([2, 7]);
    for (const visit of SAMPLE_VISITS) for (const item of prepareMedicationReview(visit.id).evidence) expect(item.text).toBe(visit.lines[item.line - 1]);
  });
  it('keeps missing allergies unknown', () => {
    for (const visit of SAMPLE_VISITS) expect(prepareMedicationReview(visit.id).allergyStatus).toBe('unknown');
  });
  it('does not infer a verified empty medicine list', () => {
    const review = prepareMedicationReview('visit-knee-v1');
    expect(review.evidence).toEqual([]);
    expect(review.currentStatusVerified).toBe(false);
    expect(review.gaps.map((gap) => gap.id)).toContain('list');
  });
  it('distinguishes reported adherence and future dose discussion from completed changes', () => {
    const review = prepareMedicationReview('visit-blood-pressure-v1');
    expect(review.adherence).toBe('historical_patient_report');
    expect(review.doseChange).toBe('future_possibility_only');
    expect(review.canChangeDose).toBe(false);
  });
  it('never claims interaction or dose safety screening', () => {
    for (const visit of SAMPLE_VISITS) {
      const review = prepareMedicationReview(visit.id);
      expect(review.interactionStatus).toBe('not_checked');
      expect(review.doseSafetyStatus).toBe('not_checked');
    }
  });
  it('keeps prescribing, approval, export, delivery and real-record intake locked', () => {
    for (const visit of SAMPLE_VISITS) {
      const review = prepareMedicationReview(visit.id);
      expect([review.canPrescribe, review.canSign, review.canExport, review.canSend, review.canAcceptPatientRecords]).toEqual([false, false, false, false, false]);
      expect(review.reviewStatus).toBe('awaiting_clinician_review');
    }
  });
  it('rejects unknown records', () => { expect(() => prepareMedicationReview('real-record')).toThrow(); });
  it('prepares source-linked review and resets when cases change', () => {
    render(<MedicationReview />);
    fireEvent.click(screen.getByRole('button', { name: 'Blood pressure check — Sam Placeholder' }));
    fireEvent.click(screen.getByRole('button', { name: 'Prepare sample medication review' }));
    fireEvent.click(screen.getByRole('button', { name: /Patient: I have been taking the pill/ }));
    expect(screen.getByRole('region', { name: 'Medication source transcript' })).toHaveTextContent('Patient: I have been taking the pill most days, but I miss it maybe twice a week.');
    for (const name of ['Prescribe medicine', 'Change dose', 'Sign review', 'Export review', 'Send to patient']) expect(screen.getByRole('button', { name })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Knee injury — Riley Demo' }));
    expect(screen.queryByRole('region', { name: 'Medication source transcript' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Medication documentation review' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prepare sample medication review' })).toBeEnabled();
  });
});
