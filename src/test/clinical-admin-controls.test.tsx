import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ClinicalAccessMonitor from '@/components/admin/ClinicalAccessMonitor';
const mock = vi.hoisted(() => ({ invoke: vi.fn(), from: vi.fn(), status: 'pending' }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: mock.from, functions: { invoke: mock.invoke } } }));
const row = () => ({ id: 'fictional', full_name: 'Fictional Visitor', organization: 'Test Org', role: 'Evaluator', work_email: 'test@example.invalid', phone: null, status: mock.status, created_at: '2026-10-19T03:00:00Z', nda_accepted_at: '2026-10-19T03:00:00Z', expires_at: '2099-10-26T03:00:00Z', decided_at: null, first_entered_at: null, viewing_expires_at: null, revoked_at: null, device_id: null, user_agent: null });
beforeEach(() => {
  mock.status = 'pending'; mock.invoke.mockReset(); mock.from.mockReset();
  mock.from.mockImplementation((table: string) => ({ select: () => ({ order: () => ({ limit: async () => ({ data: table === 'hc_access_requests' ? [row()] : [], error: null }) }) }) }));
});
afterEach(cleanup);
describe('Clinical Access confirmation controls', () => {
  it('does not approve until confirmation, then reads the updated status', async () => {
    mock.invoke.mockImplementation(async () => { mock.status = 'approved'; return { data: { ok: true, email_accepted: true }, error: null }; });
    render(<ClinicalAccessMonitor />);
    fireEvent.click(await screen.findByRole('button', { name: 'Approve', exact: true }));
    expect(mock.invoke).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm approve' }));
    await waitFor(() => expect(mock.invoke).toHaveBeenCalledWith('health-access', { body: { action: 'admin_decision', request_id: 'fictional', decision: 'approve', expected_status: 'pending', confirmed: true } }));
    await screen.findByRole('button', { name: 'Revoke', exact: true });
    expect(screen.getByRole('status').textContent).toContain('inbox delivery is not yet confirmed');
  });
  it('canceling a denial makes no request', async () => {
    render(<ClinicalAccessMonitor />); fireEvent.click(await screen.findByRole('button', { name: 'Deny', exact: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' })); expect(mock.invoke).not.toHaveBeenCalled();
  });
  it('displays saved approval with failed invitation instead of claiming email delivery', async () => {
    mock.invoke.mockResolvedValue({ data: { ok: true, email_accepted: false }, error: null });
    render(<ClinicalAccessMonitor />); fireEvent.click(await screen.findByRole('button', { name: 'Approve', exact: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm approve' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('invitation email was not confirmed sent'));
  });
});