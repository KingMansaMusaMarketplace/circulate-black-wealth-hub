import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PilotReadiness from '../pages/health/workspace/PilotReadiness';
const mocks = vi.hoisted(() => ({ invoke: vi.fn(), reload: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke: mocks.invoke } } }));
vi.mock('@/pages/health/workspace/hc', () => ({ useRows: () => ({ rows: [], loading: false, reload: mocks.reload }) }));
describe('pilot readiness submission', () => {
  it('submits boolean readiness only, without patient text or a supplied owner', async () => {
    mocks.invoke.mockResolvedValueOnce({ data: { real_records_allowed: false }, error: null });
    render(<MemoryRouter><PilotReadiness clinicId="clinic-1" clinicRole="owner" /></MemoryRouter>);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Signed clinic agreement' }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit readiness request' }));
    await waitFor(() => expect(mocks.reload).toHaveBeenCalled());
    expect(mocks.invoke).toHaveBeenCalledWith('health-kayla-review', { body: { action: 'pilot_request', clinic_id: 'clinic-1', checklist: {
      clinic_baa_reported: true, vendor_baas_reported: false, attorney_review_reported: false, safeguards_reported: false, doctor_assigned_reported: false,
    } } });
  });
  it('does not permit staff to report readiness', () => {
    render(<MemoryRouter><PilotReadiness clinicId="clinic-1" clinicRole="staff" /></MemoryRouter>);
    expect(screen.queryByRole('button', { name: 'Submit readiness request' })).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Signed clinic agreement' })).toBeDisabled();
  });
});