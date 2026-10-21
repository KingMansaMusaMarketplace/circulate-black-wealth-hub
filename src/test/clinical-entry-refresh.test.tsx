import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import HealthAccessGate from '@/pages/health/HealthAccessGate';

const mock = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: { getSession: async () => ({ data: { session: null } }) },
  functions: { invoke: mock.invoke },
} }));
vi.mock('@/pages/health/ClinicalVoice', () => ({ ClinicalVoiceProvider: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/pages/health/ClinicalHelpConversation', () => ({ ClinicalHelpConversationProvider: ({ children }: { children: React.ReactNode }) => children }));
const token = 'a'.repeat(48);
const mount = () => render(<HelmetProvider><HealthAccessGate><p>Verified demo</p></HealthAccessGate></HelmetProvider>);
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
afterEach(() => { cleanup(); window.history.replaceState({}, '', '/'); });

describe('emailed clinical root link refresh', () => {
  it('keeps refresh on /health and rechecks the same grant with its original deadline', async () => {
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();
    mock.invoke.mockResolvedValue({ data: { ok: true, name: 'Fictional Visitor', email: 'test@example.invalid', server_now: new Date().toISOString(), viewing_expires_at: expiresAt }, error: null });
    window.history.replaceState({}, '', `/?access=${token}&keep=yes#demo`);
    mount();
    await screen.findByText('Verified demo');
    expect(window.location.pathname).toBe('/health');
    expect(window.location.search).toBe('?keep=yes');
    expect(window.location.hash).toBe('#demo');
    expect(localStorage.getItem('hc_preview_access')).toBe(token);
    cleanup(); mock.invoke.mockClear(); mount();
    await screen.findByText('Verified demo');
    expect(mock.invoke).toHaveBeenCalledWith('health-access', { body: expect.objectContaining({ action: 'verify', token, path: '/health' }) });
    expect(screen.getByText(/Private viewing · 10:00/)).toBeInTheDocument();
    expect(localStorage.getItem('hc_preview_session_end')).toBeNull();
  });

  it('shows the ended lock after reload at the sanitized address, without reopening access', async () => {
    window.history.replaceState({}, '', `/?access=${token}`);
    mock.invoke.mockResolvedValue({ data: { ok: false, reason: 'expired' }, error: null });
    mount();
    await waitFor(() => expect(window.location.pathname).toBe('/health'));
    cleanup();
    localStorage.removeItem('hc_preview_access');
    localStorage.setItem('hc_preview_session_closed', 'true');
    mock.invoke.mockClear(); mount();
    await screen.findByText('Your private viewing has ended');
    expect(screen.queryByText('Verified demo')).toBeNull();
    expect(mock.invoke).not.toHaveBeenCalled();
  });

  it('preserves non-root clinical destinations when removing an access token', async () => {
    window.history.replaceState({}, '', `/health/app?access=${token}`);
    mock.invoke.mockResolvedValue({ data: { ok: false, reason: 'expired' }, error: null });
    mount();
    await waitFor(() => expect(window.location.search).toBe(''));
    expect(window.location.pathname).toBe('/health/app');
  });
});