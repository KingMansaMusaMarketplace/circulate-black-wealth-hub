import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ChartPrep from '@/pages/health/workspace/ChartPrep';

afterEach(cleanup);

describe('chart prep source selection', () => {
  it('clears the previous handoff when the prior visit changes', () => {
    render(<ChartPrep />);
    fireEvent.click(screen.getByRole('button', { name: 'Prepare sample handoff' }));
    expect(screen.getByRole('button', { name: /View source line 2: Patient: The pain is better/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Knee injury — Riley Demo' }));
    expect(screen.queryByRole('button', { name: /View source line 2: Patient: The pain is better/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Prepare sample handoff' }));
    expect(screen.getByRole('button', { name: /View source line 2: Patient: I twisted my right knee/ })).toBeTruthy();
  });
});