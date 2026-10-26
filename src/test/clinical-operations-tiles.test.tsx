import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ClinicalOperationsTiles from '@/pages/health/workspace/ClinicalOperationsTiles';
import { browserConnection, collectionTotals, flowCounts, OPERATIONS_CAPABILITIES, OPERATIONS_SCENARIO, supplyStatus } from '@/pages/health/workspace/operations-scenario';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('illustrative dashboard operations', () => {
  it('sums only cash and M-Pesa as received in the fixed scenario', () => {
    expect(collectionTotals(OPERATIONS_SCENARIO.collections)).toEqual({ received: 24000, awaiting: 12500 });
  });
  it('never counts SHA pending as received', () => {
    expect(collectionTotals({ cash: 0, mpesa: 0, shaAwaiting: 90000 })).toEqual({ received: 0, awaiting: 90000 });
  });
  it('rejects invalid amounts rather than inventing totals', () => {
    for (const value of [-1, NaN, Infinity]) expect(() => collectionTotals({ cash: value, mpesa: 0, shaAwaiting: 0 })).toThrow();
  });
  it('flags only stock below the illustrative minimum', () => {
    expect(supplyStatus(3, 5)).toBe('Low stock');
    expect(supplyStatus(5, 5)).toBe('Adequate');
    expect(supplyStatus(6, 5)).toBe('Adequate');
    expect(() => supplyStatus(-1, 5)).toThrow();
    expect(() => supplyStatus(1.5, 5)).toThrow();
  });
  it('keeps stage counts consistent with six independent fictional entries', () => {
    expect(flowCounts()).toEqual([{ id: 'waiting', count: 2 }, { id: 'triage', count: 1 }, { id: 'clinician', count: 1 }, { id: 'complete', count: 2 }]);
    expect(new Set(OPERATIONS_SCENARIO.flow.flatMap(stage => stage.entries.map(entry => entry.id))).size).toBe(6);
  });
  it('keeps every clinical operational capability disabled', () => {
    expect(OPERATIONS_CAPABILITIES).toEqual({ patientEntry: false, queueUpdates: false, collectPayment: false, submitInsurance: false, dispense: false, reorder: false, export: false, persist: false, offlineRecords: false, offlineSync: false });
  });
  it('shows unknown rather than assuming online if the browser has no signal', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(undefined as unknown as boolean);
    expect(browserConnection()).toBe('Unknown');
  });
  it('responds to actual browser signals and removes listeners on exit', () => {
    const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ClinicalOperationsTiles />);
    expect(screen.getByRole('status', { name: 'Browser connection state' })).toHaveTextContent('Online');
    online.mockReturnValue(false);
    fireEvent(window, new Event('offline'));
    expect(screen.getByRole('status', { name: 'Browser connection state' })).toHaveTextContent('Offline');
    expect(OPERATIONS_CAPABILITIES.offlineRecords).toBe(false);
    expect(OPERATIONS_CAPABILITIES.offlineSync).toBe(false);
    online.mockReturnValue(true);
    fireEvent(window, new Event('online'));
    expect(screen.getByRole('status', { name: 'Browser connection state' })).toHaveTextContent('Online');
    unmount();
    expect(remove).toHaveBeenCalledWith('online', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('offline', expect.any(Function));
  });
  it('keeps all detail actions local without network or persistence', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const store = vi.spyOn(Storage.prototype, 'setItem');
    const { unmount } = render(<ClinicalOperationsTiles />);
    fireEvent.click(screen.getByRole('button', { name: '2 Waiting' }));
    expect(screen.getByText('FLOW-01 · fictional visitor')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sample breakdown' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sample inventory' }));
    expect(screen.getByText('3 boxes · sample minimum 5')).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(store).not.toHaveBeenCalled();
    unmount();
    render(<ClinicalOperationsTiles />);
    expect(screen.queryByText('FLOW-01 · fictional visitor')).toBeNull();
    expect(screen.getByRole('button', { name: 'Sample breakdown' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Sample inventory' })).toHaveAttribute('aria-expanded', 'false');
  });
});