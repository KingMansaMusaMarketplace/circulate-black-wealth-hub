import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PatientCommunication from '@/pages/health/workspace/PatientCommunication';
import { patientCommunication } from '@/pages/health/workspace/patient-communication';
import { SAMPLE_VISITS } from '@/pages/health/workspace/sample-visits';

afterEach(cleanup);
describe('fictional patient communication safeguards', () => {
  it('keeps every live communication action locked', () => {
    for (const visit of SAMPLE_VISITS) {
      const state = patientCommunication(visit.id);
      expect([state.canSend, state.canSchedule, state.canInvite, state.canApprove, state.canReceive, state.canEnterPatientData]).toEqual([false, false, false, false, false, false]);
      expect(state.healthcareClearance).toBe('blocked');
    }
  });
  it('never invents consent, review or delivery', () => {
    const state = patientCommunication(SAMPLE_VISITS[0].id);
    expect(state.consentStatus).toBe('not_verified');
    expect(state.reviewStatus).toBe('unapproved');
    expect(state.deliveryStatus).toBe('not_sent');
    expect(state.guide.canDeliver).toBe(false);
  });
  it('uses transcript words without representing them as received messages', () => {
    for (const visit of SAMPLE_VISITS) {
      const state = patientCommunication(visit.id);
      expect(state.message.quote).toBe(visit.lines[state.message.line - 1]);
      expect(state.message.origin).toBe('visit_transcript');
      expect(state.message.received).toBe(false);
    }
  });
  it('preserves follow-up intervals without inventing appointments', () => {
    expect(patientCommunication('visit-back-pain-v1').followUp[0].quote).toBe('Doctor: I will see you again in six weeks.');
    expect(patientCommunication('visit-blood-pressure-v1').followUp[0].quote).toBe('Doctor: Please check your blood pressure at home and bring the log in four weeks.');
    expect(patientCommunication('visit-knee-v1').followUp).toEqual([]);
    for (const visit of SAMPLE_VISITS) {
      expect(patientCommunication(visit.id).appointmentDate).toBeNull();
      expect(patientCommunication(visit.id).recipient).toBeNull();
    }
  });
  it('rejects arbitrary case identifiers', () => { expect(() => patientCommunication('real-patient')).toThrow(); });
  it('resets language and selected evidence on case changes without unlocking delivery', () => {
    render(<PatientCommunication />);
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Care guide' }), { button: 0, ctrlKey: false });
    fireEvent.click(screen.getByRole('button', { name: 'Español' }));
    fireEvent.click(screen.getByRole('button', { name: SAMPLE_VISITS[2].title }));
    expect(screen.getByRole('tab', { name: 'Message' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Care guide' }), { button: 0, ctrlKey: false });
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    for (const name of ['Send message', 'Schedule reminder', 'Invite patient']) expect(screen.getByRole('button', { name })).toBeDisabled();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});