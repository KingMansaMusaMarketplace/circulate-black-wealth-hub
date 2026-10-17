import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ExecutiveWalkthrough from '@/pages/health/ExecutiveWalkthrough';
import ExecutiveNotePreview from '@/pages/health/ExecutiveNotePreview';
import { EXECUTIVE_TOUR_STEPS } from '@/pages/health/executive-tour';

afterEach(cleanup);

describe('clinical executive walkthrough', () => {
  it('navigates chart prep, note drafting, doctor review, then care guide without automatically advancing', () => {
    const step = vi.fn();
    const end = vi.fn();
    render(<ExecutiveWalkthrough onStep={step} onEnd={end} />);
    fireEvent.click(screen.getByRole('button', { name: 'Start 2-minute walkthrough' }));
    expect(step.mock.calls).toEqual([['prep', 0]]);
    for (let i = 1; i < 4; i++) fireEvent.click(screen.getByRole('button', { name: 'Next step' }));
    expect(step.mock.calls).toEqual([['prep', 0], ['notes', 1], ['notes', 2], ['care', 3]]);
    fireEvent.click(screen.getByRole('button', { name: 'Finish walkthrough' }));
    expect(end).toHaveBeenCalledTimes(1);
    expect(step).toHaveBeenCalledTimes(4);
  });

  it('supports back, exit, and restart without retaining the previous step', () => {
    const step = vi.fn();
    const end = vi.fn();
    render(<ExecutiveWalkthrough onStep={step} onEnd={end} />);
    fireEvent.click(screen.getByRole('button', { name: 'Start 2-minute walkthrough' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next step' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous step' }));
    expect(step).toHaveBeenLastCalledWith('prep', 0);
    fireEvent.click(screen.getByRole('button', { name: 'Exit walkthrough' }));
    expect(end).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Start 2-minute walkthrough' }));
    expect(step).toHaveBeenLastCalledWith('prep', 0);
    fireEvent.keyDown(screen.getByRole('heading', { name: 'Before the visit' }), { key: 'Escape' });
    expect(end).toHaveBeenCalledTimes(2);
  });

  it('allocates two minutes across the four stops', () => {
    expect(EXECUTIVE_TOUR_STEPS.map((step) => step.seconds)).toEqual([30, 45, 30, 15]);
    expect(EXECUTIVE_TOUR_STEPS.reduce((total, step) => total + step.seconds, 0)).toBe(120);
  });

  it('cannot sign or export an unsigned note in the investor preview', () => {
    render(<ExecutiveNotePreview review />);
    expect(screen.getByRole('button', { name: 'Sign note — clinic workspace only' })).toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'Signed report unavailable' })).toHaveProperty('disabled', true);
  });
});