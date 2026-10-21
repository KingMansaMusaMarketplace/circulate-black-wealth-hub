import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StartHere, { START_HERE_STEPS } from '@/pages/health/workspace/StartHere';

describe('Start here path', () => {
  it('has exactly three steps in order', () => {
    expect(START_HERE_STEPS.map((s) => s.k)).toEqual(['doctor-day', 'notes', 'billing']);
  });
  it('opens the chosen screen and can be skipped', () => {
    localStorage.clear();
    const onGo = vi.fn();
    render(<StartHere current="review" onGo={onGo} />);
    fireEvent.click(screen.getByText(/Visit note/));
    expect(onGo).toHaveBeenCalledWith('notes');
    fireEvent.click(screen.getByText(/Skip, show all features/));
    expect(screen.queryByText(/Visit note/)).toBeNull();
  });
});
