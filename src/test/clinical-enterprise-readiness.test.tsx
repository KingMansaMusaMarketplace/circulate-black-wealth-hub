import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import EnterpriseReadiness from '@/pages/health/EnterpriseReadiness';
import { enterpriseReadiness } from '@/pages/health/enterprise-readiness';
import { intakeAvailability } from '@/pages/health/workspace/intake-policy';

afterEach(cleanup);
describe('Enterprise readiness boundaries', () => {
  it('does not mark fictional evaluation as completed validation', () => {
    expect(enterpriseReadiness().phases[0].status).toBe('available_for_evaluation');
  });
  it('keeps legal and vendor clearance unverified', () => {
    expect(enterpriseReadiness().phases[1].status).toBe('not_verified');
  });
  it('does not represent a real-record pilot as activated', () => {
    expect(enterpriseReadiness().phases[2].status).toBe('locked');
  });
  it('keeps agreement uploads, real records and patient calls blocked by the existing policy', () => {
    const state = enterpriseReadiness();
    expect([state.agreementUploadAllowed, state.realRecordsAllowed, state.patientCallsAllowed]).toEqual([false, false, false]);
    expect(state.realRecordsAllowed).toBe(intakeAvailability().cmeUpload);
    expect(state.canApprove).toBe(false);
  });
  it('opening and closing the drawer never changes processing restrictions', () => {
    const before = enterpriseReadiness();
    render(<EnterpriseReadiness />);
    fireEvent.click(screen.getByRole('button', { name: 'Readiness' }));
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(enterpriseReadiness()).toEqual(before);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(enterpriseReadiness()).toEqual(before);
  });
});