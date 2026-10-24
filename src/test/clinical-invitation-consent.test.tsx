import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import HealthAccessGate from '@/pages/health/HealthAccessGate';

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: { getSession: async () => ({ data: { session: null } }) }, functions: { invoke },
} }));
vi.mock('@/pages/health/ClinicalVoice', () => ({ ClinicalVoiceProvider: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@/pages/health/ClinicalHelpConversation', () => ({ ClinicalHelpConversationProvider: ({ children }: { children: React.ReactNode }) => children }));
afterEach(() => { cleanup(); localStorage.clear(); invoke.mockReset(); });

it('keeps invited content locked until deliberate confidentiality acceptance', async () => {
  localStorage.setItem('hc_preview_access', 'a'.repeat(48));
  invoke.mockResolvedValueOnce({ data: { ok: false, reason: 'confidentiality' }, error: null });
  const grant = { data: { ok: true, name: 'Fictional invited visitor', email: 'visitor@example.invalid', viewing_duration_minutes: 60,
    server_now: new Date().toISOString(), viewing_expires_at: new Date(Date.now() + 3600000).toISOString() }, error: null };
  invoke.mockResolvedValue(grant);
  render(<HelmetProvider><HealthAccessGate><p>Private invited content</p></HealthAccessGate></HelmetProvider>);
  const accept = await screen.findByRole('button', { name: 'Accept confidentiality terms and enter' });
  expect(screen.queryByText('Private invited content')).not.toBeInTheDocument();
  expect(invoke.mock.calls.some(([, options]) => options.body.nda === true)).toBe(false);
  fireEvent.click(accept);
  expect(await screen.findByText('Private invited content')).toBeInTheDocument();
  expect(invoke.mock.calls.some(([, options]) => options.body.nda === true)).toBe(true);
});