import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { authorizeClinicalPreview } from '../_shared/clinical-preview-auth.ts';

function service(admin: boolean, grant: unknown) {
  const query = { select: () => query, eq: () => query, not: () => query, maybeSingle: () => Promise.resolve({ data: grant, error: null }) };
  return { rpc: () => Promise.resolve({ data: admin, error: null }), from: () => query } as unknown as Parameters<typeof authorizeClinicalPreview>[0];
}
const user = { id: 'fictional-account', email: 'fixture@example.invalid' };
const request = (device = 'b'.repeat(32)) => new Request('https://example.invalid', { headers: { 'x-hc-preview-token': 'a'.repeat(48), 'x-hc-preview-device': device } });
Deno.test('clinical authorization denies absent approval proof', async () => {
  assertEquals(await authorizeClinicalPreview(service(false, null), new Request('https://example.invalid'), user), false);
});
Deno.test('clinical authorization accepts server verified admin without visitor proof', async () => {
  assertEquals(await authorizeClinicalPreview(service(true, null), new Request('https://example.invalid'), user), true);
});
Deno.test('clinical authorization matches approved email and unexpired deadline', async () => {
  const grant = { work_email: user.email, viewing_expires_at: new Date(Date.now() + 300000).toISOString() };
  assertEquals(await authorizeClinicalPreview(service(false, grant), request(), user), true);
  assertEquals(await authorizeClinicalPreview(service(false, grant), request(), { ...user, email: 'other@example.invalid' }), false);
  assertEquals(await authorizeClinicalPreview(service(false, { ...grant, viewing_expires_at: new Date(Date.now() - 1).toISOString() }), request(), user), false);
});
Deno.test('clinical authorization denies invalid device and missing grant', async () => {
  assertEquals(await authorizeClinicalPreview(service(false, null), request('wrong'), user), false);
  assertEquals(await authorizeClinicalPreview(service(false, null), request(), user), false);
});