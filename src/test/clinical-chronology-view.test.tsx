import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import MedicalChronology from '@/pages/health/workspace/MedicalChronology';

afterEach(cleanup);
describe('chronology sources', () => {
  it('opens the actual page and quotation for a conflicting-history flag', () => {
    render(<MedicalChronology />);
    fireEvent.click(screen.getByRole('button', { name: 'Prior symptom history differs: source page 2, excerpt 2' }));
    const source = screen.getByRole('region', { name: 'Chronology source page' });
    expect(within(source).getByText('Patient reports new low back pain and denies prior back symptoms.')).toBeTruthy();
    expect(within(source).getByText(/Page 2 · 02_Incident-and-ER.txt/)).toBeTruthy();
    fireEvent.click(within(source).getByRole('button', { name: 'Close source' }));
    expect(screen.queryByRole('region', { name: 'Chronology source page' })).toBeNull();
  });
});