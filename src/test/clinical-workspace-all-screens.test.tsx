// Smoke check: every screen in the private Clinical workspace menu opens without crashing
// for a signed-in clinic owner (all server answers are empty fictional responses).
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

const CLINIC = { id: '11111111-1111-4111-8111-111111111111', name: 'Smoke Test Clinic' };

vi.mock('@/integrations/supabase/client', () => {
  const chain = (table: string): unknown => {
    let single = false;
    const result = () => ({ data: table === 'hc_members' && single ? { role: 'owner', hc_clinics: CLINIC } : single ? null : [], error: null, count: 0 });
    const proxy: unknown = new Proxy(function () {}, {
      get(_t, prop) {
        if (prop === 'then') return (ok: (v: unknown) => unknown, bad?: (e: unknown) => unknown) => Promise.resolve(result()).then(ok, bad);
        if (prop === 'maybeSingle' || prop === 'single') single = true;
        return () => proxy;
      },
      apply() { return proxy; },
    });
    return proxy;
  };
  const sub = { data: { subscription: { unsubscribe() {} } } };
  const channel = { on() { return channel; }, subscribe() { return channel; }, unsubscribe() {} };
  return {
    supabase: {
      from: (t: string) => chain(t),
      rpc: () => chain('rpc'),
      channel: () => channel,
      removeChannel: () => {},
      functions: { invoke: async () => ({ data: null, error: null }) },
      storage: { from: () => chain('storage') },
      auth: {
        getSession: async () => ({ data: { session: { access_token: 't', user: { id: 'u1', email: 'doc@example.com' } } }, error: null }),
        getUser: async () => ({ data: { user: { id: 'u1', email: 'doc@example.com' } }, error: null }),
        onAuthStateChange: () => sub,
        signOut: async () => ({ error: null }),
      },
    },
  };
});
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1', email: 'doc@example.com' }, loading: false, authInitialized: true }),
}));

const SCREENS = [
  'Ask Kayla', 'Connected Doctor Day', 'Delegation Desk', 'Expanded Sample Chart', 'Medication Review Assistance',
  'Clinical Data Explorer', 'Kenya IDSR Reporting', 'Clinical Connections', 'National Health Exchange',
  'Patient Communication', 'Clinic Intake', 'Dashboard', 'Pilot Patients (test records)', 'Patients', 'Schedule',
  'Pre-Visit Chart Prep', 'Medical Chronology', 'CME Files & Review', 'AI Note-Taking', 'Care Guide',
  'Billing Documentation Check', 'Prior Authorization', 'Practice Impact', 'Specialty Examples', 'Billing Preparation',
  'Backup, Recovery & Migration', 'Doctor Evaluation', 'Executive Quality Overview',
];

describe('Clinical workspace screens', () => {
  it('opens all 28 menu screens without crashing', async () => {
    const { default: HealthWorkspacePage } = await import('@/pages/health/HealthWorkspacePage');
    const errors: unknown[] = [];
    const spy = vi.spyOn(console, 'error').mockImplementation((...a) => { errors.push(a[0]); });
    render(<HelmetProvider><MemoryRouter initialEntries={['/health/app']}><HealthWorkspacePage /></MemoryRouter></HelmetProvider>);
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Dashboard' }).length).toBeGreaterThan(0), { timeout: 5000 });
    const failed: string[] = [];
    for (const label of SCREENS) {
      try {
        const btn = screen.getAllByRole('button', { name: label })[0];
        fireEvent.click(btn);
        await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: label })).toBeTruthy());
      } catch (e) { failed.push(`${label}: ${(e as Error).message.split('\n')[0]}`); }
    }
    spy.mockRestore();
    const crashes = errors.filter((e) => /The above error occurred|Uncaught|is not a function|Cannot read/.test(String(e)));
    expect(failed).toEqual([]);
    expect(crashes).toEqual([]);
  }, 180000);
});
