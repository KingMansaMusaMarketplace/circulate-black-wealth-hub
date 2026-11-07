import { describe, it, expect, vi } from 'vitest';

const rpc = vi.fn();
vi.mock('@/pages/health/workspace/hc', () => ({ db: { rpc: (...a: unknown[]) => rpc(...a) } }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { auth: { getUser: async () => ({ data: { user: { id: 'u1', email: 'partner@1325.ai' } }, error: null }) } },
}));

import { registerSampleClinic } from '@/pages/health/workspace/clinic-registration';

describe('registerSampleClinic', () => {
  it('explains an email mismatch when the viewing belongs to another account', async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: 'Current owner-approved viewing required' } });
    await expect(registerSampleClinic('1325 Pilot Clinic', '')).rejects.toThrow(/signed in as partner@1325\.ai/);
  });

  it('returns the clinic id on success', async () => {
    rpc.mockResolvedValueOnce({ data: 'clinic-1', error: null });
    await expect(registerSampleClinic('1325 Pilot Clinic', 'Family Medicine')).resolves.toBe('clinic-1');
  });
});
