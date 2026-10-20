import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import HealthAccessGate from '@/pages/health/HealthAccessGate';

const { invoke, getSession } = vi.hoisted(() => ({ invoke: vi.fn(), getSession: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: { getSession }, functions: { invoke },
} }));
vi.mock('@/pages/health/ClinicalVoice', () => ({ ClinicalVoiceProvider: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/pages/health/ClinicalHelpConversation', () => ({ ClinicalHelpConversationProvider: ({ children }: { children: React.ReactNode }) => children }));

const verified = { data: { ok: true, admin: true, name: 'Fictional Owner', email: 'owner@example.invalid' }, error: null };
const mount = () => render(<HelmetProvider><HealthAccessGate><p>Private owner content</p></HealthAccessGate></HelmetProvider>);
beforeEach(() => {
  localStorage.clear(); invoke.mockReset(); getSession.mockReset();
  getSession.mockResolvedValue({ data: { session: { user: { id: 'fictional-owner' } } } });
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('unlimited server-verified owner access', () => {
  it('refreshes the watermark identity when a different administrator is verified', async () => {
    invoke.mockResolvedValue(verified); mount(); await screen.findByText('Private owner content');
    invoke.mockResolvedValue({ data: { ...verified.data, name: 'Second Fictional Owner', email: 'second@example.invalid' }, error: null });
    act(() => window.dispatchEvent(new Event('focus')));
    await waitFor(() => expect(document.body.textContent).toContain('second@example.invalid'));
    expect(document.body.textContent).not.toContain('owner@example.invalid');
  });
  it('opens after administrator sign-in despite a previous visitor exit', async () => {
    localStorage.setItem('hc_preview_session_closed', 'true');
    localStorage.setItem('hc_preview_session_end', 'expired');
    invoke.mockResolvedValue(verified); mount();
    expect(await screen.findByText('Private owner content')).toBeInTheDocument();
    expect(localStorage.getItem('hc_preview_session_closed')).toBeNull();
    expect(localStorage.getItem('hc_preview_session_end')).toBeNull();
    expect(invoke).toHaveBeenCalledWith('health-access', { body: { action: 'admin' } });
  });
  it('keeps verified administrator viewing open beyond twenty minutes', async () => {
    vi.useFakeTimers(); invoke.mockResolvedValue(verified);
    await act(async () => { mount(); });
    await act(async () => { await vi.advanceTimersByTimeAsync(21 * 60 * 1000); });
    expect(screen.getByText('Private owner content')).toBeInTheDocument();
    expect(invoke.mock.calls.every(([, options]) => options.body.action === 'admin')).toBe(true);
  });
  it.each([
    { data: { ...verified.data, admin: false }, error: null },
    { data: verified.data, error: new Error('Unavailable') },
    { data: { ok: false }, error: null },
  ])('does not remove visitor locks without successful server role verification: %j', async (response) => {
    localStorage.setItem('hc_preview_session_closed', 'true');
    invoke.mockResolvedValue(response); mount();
    await screen.findByText('Your private viewing has ended');
    expect(screen.queryByText('Private owner content')).not.toBeInTheDocument();
    expect(localStorage.getItem('hc_preview_session_closed')).toBe('true');
  });
  it('locks private content when periodic server verification removes administrator access', async () => {
    invoke.mockResolvedValue(verified); mount();
    await screen.findByText('Private owner content');
    invoke.mockResolvedValue({ data: { ok: false }, error: null });
    act(() => { window.dispatchEvent(new Event('focus')); });
    await waitFor(() => expect(screen.queryByText('Private owner content')).not.toBeInTheDocument());
  });
});