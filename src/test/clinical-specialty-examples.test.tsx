import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SpecialtyExamples from '@/pages/health/workspace/SpecialtyExamples';
import { getSpecialtyExample, SPECIALTIES, specialtyExcerpt } from '@/pages/health/workspace/specialty-examples';
import { findVisit } from '@/pages/health/workspace/sample-visits';

afterEach(cleanup);

describe('Fictional specialty examples', () => {
  it('provides exactly the three approved specialties', () => {
    expect(SPECIALTIES).toEqual(['Primary Care', 'Orthopedics', 'Cardiology']);
  });
  it('uses the existing primary care transcript without combining patients', () => {
    expect(getSpecialtyExample('Primary Care').transcript).toEqual(findVisit('visit-blood-pressure-v1')?.lines);
  });
  it('uses the existing knee transcript for orthopedics without adding findings', () => {
    expect(getSpecialtyExample('Orthopedics').transcript).toEqual(findVisit('visit-knee-v1')?.lines);
  });
  it('keeps cardiology separate from other fictional patients', () => {
    const sample = getSpecialtyExample('Cardiology');
    expect(sample.id).toBe('specialty-cardiology-v1');
    expect(sample.transcript[0]).toContain('Casey Example');
    expect(sample.transcript[4]).toBe('Doctor: I cannot establish the cause from this conversation alone. No diagnosis is confirmed in this example.');
  });
  it.each(SPECIALTIES)('%s remains fictional, unsigned and unavailable for delivery', (specialty) => {
    const sample = getSpecialtyExample(specialty);
    expect([sample.fictional, sample.reviewStatus, sample.canSign, sample.canExport, sample.canSend]).toEqual([true, 'awaiting_doctor_review', false, false, false]);
    for (const section of sample.sections) for (const line of section.lines) expect(specialtyExcerpt(sample, line)).toBe(sample.transcript[line - 1]);
  });
  it('rejects missing and invalid source lines', () => {
    const sample = getSpecialtyExample('Cardiology');
    for (const line of [0, -1, 7, 1.5, NaN]) expect(() => specialtyExcerpt(sample, line)).toThrow('Source line does not exist.');
  });
  it('switches cases and clears the previous case’s selected source', () => {
    Element.prototype.scrollIntoView = vi.fn();
    render(<SpecialtyExamples />);
    fireEvent.click(screen.getByRole('button', { name: 'View source line 2' }));
    expect(screen.getByRole('region', { name: 'Specialty transcript' }).querySelector('[aria-current="true"]')?.textContent).toContain('miss it maybe twice a week');
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Orthopedics' }), { button: 0, ctrlKey: false });
    expect(screen.getByRole('region', { name: 'Specialty transcript' }).querySelector('[aria-current="true"]')).toBeNull();
    expect(within(screen.getByRole('region', { name: 'Specialty transcript' })).getByText(/twisted my right knee/)).toBeTruthy();
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Cardiology' }), { button: 0, ctrlKey: false });
    fireEvent.click(screen.getByRole('button', { name: 'View source line 4' }));
    expect(screen.getByRole('region', { name: 'Specialty transcript' }).querySelector('[aria-current="true"]')?.textContent).toContain('outside tracing is not available');
    expect(screen.getByRole('button', { name: 'Signature unavailable' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Export unavailable' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sending locked' })).toBeDisabled();
  });
});