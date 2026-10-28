import { describe, expect, it, vi, beforeEach } from 'vitest';
import { verifyClinicalFacilities } from '@/pages/health/workspace/fhir/clinical-verification';
const { getUser, from, eq } = vi.hoisted(() => ({ getUser: vi.fn(), from: vi.fn(), eq: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: { getUser }, from } }));
beforeEach(() => {
  vi.resetAllMocks();
  from.mockReturnValue({ select: () => ({ eq }) });
  getUser.mockResolvedValue({ data: { user: { id: 'viewer' } }, error: null });
});
describe('Clinical hosted sign-in and facility membership verification', () => {
  it('requires hosted sign-in before checking memberships', async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect(await verifyClinicalFacilities()).toMatchObject({ status: 'signed-out', clinics: [], checkedAt: null });
    expect(from).not.toHaveBeenCalled();
  });
  it('uses only the verified current user and returns their matching permitted clinic', async () => {
    eq.mockResolvedValue({ data: [{ clinic_id: 'clinic', role: 'owner', hc_clinics: { id: 'clinic', name: 'Sample clinic' } }], error: null });
    const result = await verifyClinicalFacilities();
    expect(eq).toHaveBeenCalledWith('user_id', 'viewer');
    expect(result.status).toBe('verified');
    expect(result.clinics).toEqual([{ id: 'clinic', name: 'Sample clinic', role: 'owner' }]);
    expect(result.checkedAt).not.toBeNull();
  });
  it('does not turn empty policy-filtered results into facility permission', async () => {
    eq.mockResolvedValue({ data: [], error: null });
    expect(await verifyClinicalFacilities()).toMatchObject({ status: 'no-access', clinics: [] });
  });
  it('rejects failed membership reads rather than reporting no facilities', async () => {
    eq.mockResolvedValue({ data: null, error: { message: 'denied' } });
    await expect(verifyClinicalFacilities()).rejects.toThrow();
  });
  it('rejects an account change during verification', async () => {
    eq.mockResolvedValue({ data: [], error: null });
    getUser.mockResolvedValueOnce({ data: { user: { id: 'viewer' } }, error: null }).mockResolvedValueOnce({ data: { user: { id: 'other' } }, error: null });
    await expect(verifyClinicalFacilities()).rejects.toThrow();
  });
});