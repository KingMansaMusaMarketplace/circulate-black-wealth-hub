import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import IdsrReporting from '@/pages/health/workspace/IdsrReporting';
import { aggregateSampleTallies, IDSR_CAPABILITIES, IDSR_DISEASES, sampleCsv, sampleReport, validateCounts } from '@/pages/health/workspace/idsr-reporting';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
describe('Kenya MOH 505 fictional reporting', () => {
  it('includes all 25 source disease/event rows and 36 laboratory fields', () => {
    expect(IDSR_DISEASES).toHaveLength(25);
    expect(sampleReport('cluster').labs).toHaveLength(36);
    expect(sampleReport('cluster').rows.find(row => row.disease === 'Cholera')?.counts).toEqual([2, 0, 3, 1]);
  });
  it('separates under-five from age-five-and-above cases and deaths', () => {
    const rows = aggregateSampleTallies([{ disease: 'Cholera', ageYears: 4.99, kind: 'case', count: 2 }, { disease: 'Cholera', ageYears: 5, kind: 'case', count: 3 }, { disease: 'Cholera', ageYears: 5, kind: 'death', count: 1 }]);
    expect(rows.find(row => row.disease === 'Cholera')?.counts).toEqual([2, 0, 3, 1]);
  });
  it('preserves source blocked cells rather than inventing counts', () => {
    const rows = sampleReport('zero').rows;
    expect(rows.find(row => row.disease === 'Maternal deaths')?.counts).toEqual([null, null, null, 0]);
    expect(rows.find(row => row.disease === 'Neonatal deaths')?.counts).toEqual([null, 0, null, null]);
    expect(rows.find(row => row.disease === 'Neonatal Tetanus')?.counts).toEqual([0, 0, null, null]);
    expect(() => aggregateSampleTallies([{ disease: 'Maternal deaths', ageYears: 3, kind: 'death', count: 1 }])).toThrow();
  });
  it('rejects missing, fractional, negative and invalid tallies', () => {
    for (const count of [-1, 1.5, NaN, Infinity]) expect(() => aggregateSampleTallies([{ disease: 'Cholera', ageYears: 6, kind: 'case', count }])).toThrow();
    expect(() => validateCounts([])).toThrow();
    expect(() => aggregateSampleTallies([{ disease: 'Cholera', ageYears: -1, kind: 'case', count: 1 }])).toThrow();
  });
  it('retains explicit zero reports and fixed Monday–Sunday example dates', () => {
    const r = sampleReport('zero');
    expect(r.start).toBe('2026-10-26'); expect(r.end).toBe('2026-11-01'); expect(r.reportDate).toBe('2026-11-02');
    expect(r.rows.every(row => row.counts.every(value => value === null || value === 0))).toBe(true);
  });
  it('exports mapped review CSV while refusing unknown fixture IDs', () => {
    const csv = sampleCsv('cluster');
    expect(csv).toContain('"Cholera","2","0","3","1"');
    expect(csv).toContain('"Maternal deaths","N/A","N/A","N/A","0"');
    expect(() => sampleReport('real' as 'cluster')).toThrow();
    expect(IDSR_CAPABILITIES).toEqual({ sampleExport: true, patientInput: false, persist: false, governmentSubmission: false, immediateNotification: false });
  });
  it('requires a local check before exporting, resets it, and never sends or saves records', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch'); const storeSpy = vi.spyOn(Storage.prototype, 'setItem');
    render(<IdsrReporting />);
    expect(screen.getByRole('button', { name: 'Download sample CSV' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Check sample report' }));
    expect(screen.getByRole('button', { name: 'Download sample CSV' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Laboratory surveillance' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset reporting rehearsal' }));
    expect(screen.getByRole('button', { name: 'Download sample CSV' })).toBeDisabled();
    expect(fetchSpy).not.toHaveBeenCalled(); expect(storeSpy).not.toHaveBeenCalled();
  });
});