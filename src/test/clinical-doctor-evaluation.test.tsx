import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import DoctorEvaluation from '@/pages/health/workspace/DoctorEvaluation';
import { blankEvaluation, doctorEvaluation } from '@/pages/health/workspace/doctor-evaluation';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';
afterEach(cleanup);
describe('fictional doctor evaluation safeguards', () => {
  it('keeps real testing, submission, approval and export locked for every case', () => {
    for (const visit of SAMPLE_VISITS) {
      const state = doctorEvaluation(visit.id);
      expect(state.healthcareClearance).toBe('blocked');
      expect([state.canStartPilot, state.canSubmit, state.canApprove, state.canExport]).toEqual([false, false, false, false]);
    }
  });
  it('keeps pilot activation and clinical validation unverified', () => {
    const state = doctorEvaluation(SAMPLE_VISITS[0].id);
    expect([state.pilotStatus, state.clinicalValidation]).toEqual(['not_activated', 'not_verified']);
  });
  it('does not fabricate participants, reviewers, measurements or study approval', () => {
    const state = doctorEvaluation(SAMPLE_VISITS[0].id);
    expect([state.participatingClinics, state.reviewerIdentity, state.measuredTimeMinutes, state.accuracyResult, state.safetyResult, state.studyApproval]).toEqual([null, null, null, null, null, null]);
  });
  it('starts every observation unreviewed', () => {
    expect(blankEvaluation()).toEqual({ source: 'not_reviewed', uncertainty: 'not_reviewed', clarity: 'not_reviewed', review: 'not_reviewed' });
  });
  it('uses only unchanged existing fictional transcripts', () => {
    for (const visit of SAMPLE_VISITS) expect(doctorEvaluation(visit.id).visit).toBe(visit);
    expect(() => doctorEvaluation('real-patient')).toThrow();
  });
  it('resets observations on case change and never unlocks approval', () => {
    render(<DoctorEvaluation />);
    const group = screen.getByRole('group', { name: 'Source accuracy' });
    fireEvent.click(within(group).getByRole('button', { name: 'No issue observed' }));
    expect(within(group).getByRole('button', { name: 'No issue observed' })).toHaveAttribute('aria-pressed', 'true');
    for (const action of ['Start real patient pilot', 'Submit evaluation', 'Approve pilot', 'Export study results']) expect(screen.getByRole('button', { name: action })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: SAMPLE_VISITS[2].title }));
    for (const button of screen.getAllByRole('button', { name: 'Not reviewed' })) expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});