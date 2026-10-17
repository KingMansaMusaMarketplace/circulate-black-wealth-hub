import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import EnterpriseReliability from '@/pages/health/workspace/EnterpriseReliability';
import { enterpriseReliability } from '@/pages/health/workspace/enterprise-reliability';

afterEach(cleanup);
describe('clinical operations preparation safeguards', () => {
  it('keeps real records and all operational actions locked', () => {
    const state = enterpriseReliability();
    expect(state.healthcareClearance).toBe('blocked');
    expect([state.canBackUp, state.canRestore, state.canImport, state.canApprove, state.canExport]).toEqual([false, false, false, false, false]);
  });
  it('never represents preparation as executed or independently approved', () => {
    const state = enterpriseReliability();
    expect([state.backupStatus, state.recoveryStatus, state.migrationStatus, state.independentApproval]).toEqual(['unverified', 'not_tested', 'not_started', null]);
  });
  it('does not invent reliability guarantees or recovery targets', () => {
    const state = enterpriseReliability();
    expect([state.uptimeCommitment, state.downtimeTargetMinutes, state.dataLossTargetMinutes]).toEqual([null, null, null]);
  });
  it('does not invent backup destinations, test dates or imported records', () => {
    const state = enterpriseReliability();
    expect([state.backupDestination, state.lastBackupAt, state.lastRecoveryTestAt, state.importedRecordCount, state.sourceSystem]).toEqual([null, null, null, null, null]);
  });
  it('keeps execution unavailable while visitors review every preparation area', () => {
    render(<EnterpriseReliability />);
    for (const name of ['Backups', 'Recovery', 'Clinic migration']) {
      fireEvent.mouseDown(screen.getByRole('tab', { name }), { button: 0, ctrlKey: false });
      expect(screen.getByRole('tab', { name })).toHaveAttribute('aria-selected', 'true');
      for (const action of ['Run backup', 'Restore records', 'Import clinic records', 'Approve cutover']) expect(screen.getByRole('button', { name: action })).toBeDisabled();
    }
  });
});