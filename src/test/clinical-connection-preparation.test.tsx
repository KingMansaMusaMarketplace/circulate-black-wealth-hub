import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ConnectionPreparation from '@/pages/health/workspace/ConnectionPreparation';
import { CONNECTION_TYPES, connectionPreparation } from '@/pages/health/workspace/connection-preparation';

afterEach(cleanup);
describe('clinical connection preparation safeguards', () => {
  it('covers laboratories, pharmacies and medical-record systems', () => {
    expect(CONNECTION_TYPES.map((item) => item.id)).toEqual(['laboratory', 'pharmacy', 'records']);
  });
  it('never represents providers as connected or covered', () => {
    for (const type of CONNECTION_TYPES) {
      const state = connectionPreparation(type.id);
      expect(state.status).toBe('not_connected');
      expect(state.providerStatus).toBe('not_selected');
      expect(state.coverageStatus).toBe('not_verified');
    }
  });
  it('does not fabricate validation or healthcare clearance', () => {
    for (const type of CONNECTION_TYPES) {
      const state = connectionPreparation(type.id);
      expect(state.validationStatus).toBe('not_performed');
      expect(state.healthcareClearance).toBe('blocked');
    }
  });
  it('never allows live exchange, imports, credentials or approval', () => {
    for (const type of CONNECTION_TYPES) {
      const state = connectionPreparation(type.id);
      expect([state.canConnect, state.canReceive, state.canSend, state.canImport, state.canApprove, state.canEnterCredentials]).toEqual([false, false, false, false, false, false]);
      expect(state.fictional).toBe(true);
    }
  });
  it('rejects arbitrary connection categories', () => { expect(() => connectionPreparation('external-service')).toThrow(); });
  it('shows local mapping without changing permissions and resets it on category change', () => {
    const before = connectionPreparation('laboratory');
    render(<ConnectionPreparation />);
    fireEvent.click(screen.getByRole('button', { name: 'View fictional mapping' }));
    expect(screen.getByRole('region', { name: 'Fictional connection mapping' })).toBeVisible();
    expect(connectionPreparation('laboratory')).toEqual(before);
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Pharmacy' }), { button: 0, ctrlKey: false });
    expect(screen.queryByRole('region', { name: 'Fictional connection mapping' })).not.toBeInTheDocument();
    for (const name of ['Connect provider', 'Receive records', 'Send order or prescription', 'Import into chart']) expect(screen.getByRole('button', { name })).toBeDisabled();
  });
});