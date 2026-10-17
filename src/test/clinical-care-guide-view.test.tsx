import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import CareGuide from '@/pages/health/workspace/CareGuide';
afterEach(cleanup);
describe('care guide sample isolation', () => {
  it('clears the prior guide when the fictional visit changes', () => {
    render(<CareGuide />);
    fireEvent.click(screen.getByRole('button', { name: 'Prepare sample guide' }));
    expect(screen.getAllByRole('button', { name: /View source line/ })).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'Knee injury — Riley Demo' }));
    expect(screen.queryAllByRole('button', { name: /View source line/ })).toHaveLength(0);
  });
});