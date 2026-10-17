import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DoctorDay from '@/pages/health/workspace/DoctorDay';
import { doctorDayCase, DOCTOR_DAY_CASES } from '@/pages/health/workspace/doctor-day';

vi.mock('@/pages/health/workspace/VisitNotes', () => ({ default: ({ selectedVisitId }: { selectedVisitId: string }) => <div data-testid="clinic-note-case">{selectedVisitId}</div> }));
afterEach(cleanup);

describe('connected fictional doctor-day', () => {
  it('retains one case across chart preparation and follow-up sources', () => {
    for (const item of DOCTOR_DAY_CASES) {
      const sample = doctorDayCase(item.visitId);
      expect(sample.prep.visitId).toBe(item.visitId);
      expect(sample.guide.visitId).toBe(item.visitId);
      for (const fact of sample.prep.sections.flatMap((section) => section.facts)) expect(sample.visit.lines[fact.line - 1]).toBe(fact.text);
      for (const item of sample.guide.plan) expect(sample.visit.lines[item.line - 1]).toBe(item.quote);
    }
  });
  it('rejects arbitrary records instead of accepting patient input', () => {
    expect(() => doctorDayCase('real-patient-record')).toThrow();
  });
  it('does not turn a rehearsal slot into a completed encounter', () => {
    expect(doctorDayCase('visit-knee-v1').appointmentStatus).toBe('rehearsal_only');
    expect(doctorDayCase('visit-knee-v1').currentEncounterCompleted).toBe(false);
  });
  it('never unlocks booking, guide approval or sending', () => {
    const sample = doctorDayCase('visit-back-pain-v1');
    expect(sample.canBook).toBe(false);
    expect(sample.canApproveGuide).toBe(false);
    expect(sample.canSend).toBe(false);
    expect(sample.guide.canDeliver).toBe(false);
  });
  it('walks all five stages without signing or sending in the visitor preview', () => {
    render(<DoctorDay />);
    expect(screen.getByRole('button', { name: 'Book real appointment' })).toBeDisabled();
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('button', { name: 'Sign note — clinic workspace only' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Signed report unavailable' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('button', { name: 'Send to patient' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Return to schedule' }));
    expect(screen.getByRole('button', { name: 'Book real appointment' })).toBeDisabled();
  });
  it('clears source selection and resets to schedule when switching cases', () => {
    render(<DoctorDay />);
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: /Patient: The pain is better/ }));
    expect(screen.getByRole('region', { name: 'Source transcript' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Knee injury — Riley Demo' }));
    expect(screen.queryByRole('region', { name: 'Source transcript' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
    fireEvent.click(screen.getByRole('tab', { name: '5. Follow-up' }));
    expect(screen.getByRole('button', { name: /For now, use ice/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Español' }));
    expect(screen.getByRole('button', { name: /Por ahora, use hielo/ })).toBeInTheDocument();
  });
  it('passes the selected case into existing clinic notes at both visit and review stages', () => {
    render(<DoctorDay clinicId="sample-clinic" clinicRole="doctor" />);
    fireEvent.click(screen.getByRole('button', { name: 'Blood pressure check — Sam Placeholder' }));
    fireEvent.click(screen.getByRole('tab', { name: '3. Visit transcript' }));
    expect(screen.getByTestId('clinic-note-case')).toHaveTextContent('visit-blood-pressure-v1');
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByTestId('clinic-note-case')).toHaveTextContent('visit-blood-pressure-v1');
  });
});