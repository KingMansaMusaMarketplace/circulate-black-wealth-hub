import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ClinicalDataExplorer from '@/pages/health/workspace/ClinicalDataExplorer';
import { DEFAULT_CRITERIA, searchCohort } from '@/pages/health/workspace/cohort-search';

afterEach(cleanup);
describe('fictional cohort search', () => {
  it('requires medication AND elevated creatinine', () => {
    expect(searchCohort(DEFAULT_CRITERIA).cases.map((c) => [c.id, c.status])).toEqual([['search-a', 'matched'], ['search-b', 'excluded'], ['search-c', 'excluded'], ['search-d', 'unknown']]);
  });
  it('keeps missing creatinine unknown when medication matches', () => {
    expect(searchCohort({ ...DEFAULT_CRITERIA, medicine: 'Gabapentin' }).cases.find((c) => c.id === 'search-c')?.status).toBe('unknown');
  });
  it('keeps missing medication reconciliation unknown', () => {
    expect(searchCohort(DEFAULT_CRITERIA).cases.find((c) => c.id === 'search-d')?.status).toBe('unknown');
  });
  it('keeps out-of-window results unknown', () => {
    expect(searchCohort({ ...DEFAULT_CRITERIA, from: '2026-10-04' }).cases[0].status).toBe('unknown');
  });
  it('uses strict greater-than', () => {
    expect(searchCohort({ ...DEFAULT_CRITERIA, threshold: 1.6 }).cases[0].status).toBe('excluded');
  });
  it('includes both date boundaries', () => {
    expect(searchCohort({ ...DEFAULT_CRITERIA, from: '2026-10-01', to: '2026-10-01' }).cases[0].status).toBe('matched');
  });
  it('returns exact source evidence', () => {
    const c = searchCohort(DEFAULT_CRITERIA).cases[0];
    expect(c.source[(c.medicineLine ?? 0) - 1]).toBe('Fictional medication snapshot: Metformin; Lisinopril.');
    expect(c.source[(c.lab?.line ?? 0) - 1]).toBe('Fictional laboratory result: creatinine 1.6 mg/dL, specimen date 2026-10-01.');
  });
  it.each([{ medicine: 'Drug X' }, { threshold: -1 }, { threshold: NaN }, { threshold: 21 }, { unit: 'mmol/L' }, { from: '2026-02-30' }, { to: '2026-09-01' }, { recordText: 'patient input' }])('rejects invalid or extra criteria %j', (patch) => {
    expect(() => searchCohort({ ...DEFAULT_CRITERIA, ...patch })).toThrow();
  });
  it('keeps real records, exports, recruitment and reporting unavailable', () => {
    const r = searchCohort(DEFAULT_CRITERIA);
    expect([r.liveRecordsAllowed, r.canExport, r.canRecruit, r.canSubmitReport]).toEqual([false, false, false, false]);
  });
  it('confirms, searches, opens evidence and invalidates on edits', () => {
    render(<ClinicalDataExplorer />);
    const run = screen.getByRole('button', { name: 'Run fictional search' });
    expect(run).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm criteria' }));
    fireEvent.click(run);
    expect(screen.getByRole('region', { name: 'Fictional search results' })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'View source' })[0]);
    expect(screen.getByRole('region', { name: 'Search source evidence' })).toHaveTextContent('creatinine 1.6 mg/dL');
    fireEvent.change(screen.getByLabelText('Creatinine greater than (mg/dL)'), { target: { value: '1.6' } });
    expect(run).toBeDisabled();
    expect(screen.queryByRole('region', { name: 'Fictional search results' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Search source evidence' })).not.toBeInTheDocument();
  });
  it('refuses blank thresholds', () => {
    render(<ClinicalDataExplorer />);
    fireEvent.change(screen.getByLabelText('Creatinine greater than (mg/dL)'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm criteria' }));
    expect(screen.getByRole('button', { name: 'Run fictional search' })).toBeDisabled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});