import { act, cleanup, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import HealthAccessGate from '@/pages/health/HealthAccessGate';
import { useRows } from '@/pages/health/workspace/hc';
import { administerDecision } from '../../supabase/functions/health-access/admin-decision';
import { requestNotification } from '../../supabase/functions/health-access/notification-result';
import { compileHelpQuestion } from '../../supabase/functions/_shared/clinical-help-intake';
import { PRODUCT_HELP } from '../../supabase/functions/_shared/clinical-product-catalog';

const mock = vi.hoisted(() => ({ invoke: vi.fn(), query: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: { getSession: async () => ({ data: { session: null } }) },
  functions: { invoke: mock.invoke },
  from: () => ({ select: () => ({ eq: () => ({ order: mock.query }) }) }),
} }));
vi.mock('@/pages/health/ClinicalVoice', () => ({ ClinicalVoiceProvider: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/pages/health/ClinicalHelpConversation', () => ({ ClinicalHelpConversationProvider: ({ children }: { children: React.ReactNode }) => children }));
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
afterEach(() => { cleanup(); vi.useRealTimers(); });
const mount = () => render(<HelmetProvider><HealthAccessGate><p>Approved fictional viewing</p></HealthAccessGate></HelmetProvider>);
const grant = (expires: number) => ({ data: { ok: true, name: 'Fictional Visitor', email: 'test@example.invalid', server_now: new Date().toISOString(), viewing_expires_at: new Date(expires).toISOString() }, error: null });

describe('approved readiness corrections', () => {
  it('does not claim notification acceptance when the provider rejects or throws', async () => {
    expect(await requestNotification(async () => ({ data: { id: 'message' } }))).toBe(true);
    expect(await requestNotification(async () => ({ data: { id: 'message' }, error: new Error('rejected') }))).toBe(false);
    expect(await requestNotification(async () => ({ data: null }))).toBe(false);
    expect(await requestNotification(async () => { throw new Error('offline'); })).toBe(false);
  });
  it('returns failure to the mutation caller when saved readback fails', async () => {
    mock.query.mockResolvedValue({ data: [], error: null });
    const { result } = renderHook(() => useRows('hc_visit_notes', 'fictional-clinic'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    mock.query.mockResolvedValue({ data: null, error: { message: 'offline' } });
    let loaded: unknown;
    await act(async () => { loaded = await result.current.reload(); });
    expect(loaded).toBeNull(); expect(result.current.error).not.toBe('');
  });
  it('retries an interrupted first link verification without opening before approval', async () => {
    localStorage.setItem('hc_preview_access', 'a'.repeat(48));
    mock.invoke.mockResolvedValueOnce({ error: new Error('offline') }); mount();
    await screen.findByRole('button', { name: 'Request private access' });
    expect(screen.queryByText('Approved fictional viewing')).toBeNull();
    mock.invoke.mockResolvedValue(grant(Date.now() + 20 * 60000));
    act(() => window.dispatchEvent(new Event('online')));
    await screen.findByText('Approved fictional viewing');
  });
  it('recognizes a thirty-second server extension, without a sixty-second threshold', async () => {
    const expires = Date.now() + 10 * 60000;
    localStorage.setItem('hc_preview_access', 'a'.repeat(48)); mock.invoke.mockResolvedValue(grant(expires)); mount();
    await screen.findByText('Approved fictional viewing');
    mock.invoke.mockResolvedValue(grant(expires + 30000));
    act(() => window.dispatchEvent(new Event('focus')));
    await screen.findByRole('alertdialog', { name: 'Extra time granted' });
  });
  it('keeps an ended grant locked and consumes it when connectivity returns', async () => {
    const token = 'a'.repeat(48); localStorage.setItem('hc_preview_access', token);
    localStorage.setItem('hc_preview_pending_end', token); localStorage.setItem('hc_preview_session_closed', 'true');
    mock.invoke.mockResolvedValue({ error: new Error('offline') }); mount();
    await screen.findByText('Your private viewing has ended');
    expect(localStorage.getItem('hc_preview_pending_end')).toBe(token);
    mock.invoke.mockResolvedValue({ data: { ok: false, reason: 'expired' }, error: null });
    act(() => window.dispatchEvent(new Event('online')));
    await waitFor(() => expect(localStorage.getItem('hc_preview_pending_end')).toBeNull());
    expect(localStorage.getItem('hc_preview_access')).toBeNull();
    expect(screen.queryByText('Approved fictional viewing')).toBeNull();
  });
  it('requires explicit admin approval to renew an elapsed approved visit, not an active visit', async () => {
    const save = vi.fn(async () => true); const sendApproval = vi.fn(async () => true);
    const row = { id: 'fixture', status: 'approved', revoked_at: null, full_name: 'Fictional', work_email: 'test@example.invalid', first_entered_at: new Date().toISOString(), viewing_expires_at: new Date(Date.now() - 1000).toISOString() };
    const input = { request_id: row.id, decision: 'reopen' as const, expected_status: 'approved', confirmed: true as const };
    const deps = { authorize: async () => true, read: async () => row, save, sendApproval };
    expect((await administerDecision(input, deps)).status).toBe(200); expect(sendApproval).toHaveBeenCalledOnce();
    save.mockClear(); row.viewing_expires_at = new Date(Date.now() + 60000).toISOString();
    expect((await administerDecision(input, deps)).status).toBe(409); expect(save).not.toHaveBeenCalled();
    expect((await administerDecision(input, { ...deps, authorize: async () => false })).status).toBe(403);
  });
  it('accepts exact maintained product questions but rejects appended patient details', () => {
    for (const topic of PRODUCT_HELP) {
      expect(compileHelpQuestion(topic.question)).toEqual({ topics: [topic.id], intent: 'explain' });
      expect(compileHelpQuestion(`${topic.question} for patient Jane`)).toBeNull();
    }
  });
});