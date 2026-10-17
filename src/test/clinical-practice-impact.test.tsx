import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PracticeImpact from '@/pages/health/workspace/PracticeImpact';
import { calculatePracticeImpact } from '@/pages/health/workspace/practice-impact';

afterEach(cleanup);
const scenario = { providers: 4, daysPerMonth: 20, minutesPerDay: 30, hourlyValue: 100, monthlyCost: 1000 };

describe('Practice impact estimates', () => {
  it('calculates practice-wide time and capacity value only from supplied assumptions', () => {
    expect(calculatePracticeImpact(scenario)).toEqual({ hoursPerClinician: 10, hoursPerMonth: 40, capacityValue: 4000, netModeledValue: 3000, costCoverage: 4 });
  });
  it('keeps negative modeled value instead of implying guaranteed gains', () => {
    expect(calculatePracticeImpact({ ...scenario, monthlyCost: 5000 }).netModeledValue).toBe(-1000);
  });
  it('handles zero time, hourly value and monthly cost without invented returns', () => {
    expect(calculatePracticeImpact({ ...scenario, minutesPerDay: 0, hourlyValue: 0, monthlyCost: 0 })).toEqual({ hoursPerClinician: 0, hoursPerMonth: 0, capacityValue: 0, netModeledValue: 0, costCoverage: null });
  });
  it('rejects invalid counts, impossible day values and nonfinite estimates', () => {
    for (const change of [{ providers: 0 }, { providers: 1.5 }, { daysPerMonth: 32 }, { daysPerMonth: 2.5 }, { minutesPerDay: 1441 }, { hourlyValue: -1 }, { monthlyCost: Infinity }, { minutesPerDay: NaN }]) expect(() => calculatePracticeImpact({ ...scenario, ...change })).toThrow();
  });
  it('starts without assumptions and clears stale results after edits or reset', () => {
    render(<PracticeImpact />);
    for (const input of screen.getAllByRole('spinbutton')) expect((input as HTMLInputElement).value).toBe('');
    const labels = ['Number of clinicians', 'Workdays per month, per clinician', 'Estimated minutes freed per day, per clinician', 'Your value of a clinician hour (USD)', 'Total monthly scenario cost (USD)'];
    labels.forEach((label, i) => fireEvent.change(screen.getByLabelText(label), { target: { value: [4, 20, 30, 100, 1000][i] } }));
    fireEvent.click(screen.getByRole('button', { name: 'Calculate scenario' }));
    expect(screen.getByRole('status').textContent).toContain('40 hours');
    expect(screen.getByRole('status').textContent).toContain('$3,000.00');
    fireEvent.change(screen.getByLabelText(labels[0]), { target: { value: '5' } });
    expect(screen.queryByRole('status')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Reset calculator' }));
    for (const input of screen.getAllByRole('spinbutton')) expect((input as HTMLInputElement).value).toBe('');
  });
});