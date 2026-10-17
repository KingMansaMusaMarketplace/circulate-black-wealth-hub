import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerSampleClinic } from '../pages/health/workspace/clinic-registration';

const { getUser, rpc } = vi.hoisted(() => ({ getUser: vi.fn(), rpc: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: { getUser } } }));
vi.mock('@/pages/health/workspace/hc', () => ({ db: { rpc } }));
beforeEach(() => { vi.resetAllMocks(); });
describe('signed-in clinic registration', () => {
  it('requires a validated signed-in user before saving', async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(registerSampleClinic('Test Clinic', '')).rejects.toThrow('sign in again');
    expect(rpc).not.toHaveBeenCalled();
  });
  it('saves clinic information without a caller-supplied owner and returns the saved clinic', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'verified-user' } }, error: null });
    rpc.mockResolvedValue({ data: 'saved-clinic', error: null });
    expect(await registerSampleClinic('  Test Clinic  ', '  Review  ')).toBe('saved-clinic');
    expect(rpc).toHaveBeenCalledWith('hc_create_clinic', { _name: 'Test Clinic', _specialty: 'Review' });
  });
  it('rejects failed clinic writes instead of opening an unsaved workspace', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'verified-user' } }, error: null });
    rpc.mockResolvedValue({ data: null, error: { message: 'Save failed' } });
    await expect(registerSampleClinic('Test Clinic', '')).rejects.toThrow('Save failed');
  });
});